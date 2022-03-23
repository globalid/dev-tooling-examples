import { Response } from 'express';

import { Controller, Get, Query, Render, Res } from '@nestjs/common';

import { ConnectParams } from './connect-params';
import { ConnectParamsPipe } from './connect-params.pipe';
import { ErrorParams } from './error-params';
import { VerificationsService } from './verifications.service';

@Controller('verifications')
export class VerificationsController {
  constructor(private readonly service: VerificationsService) {}

  @Get()
  @Render('verifications')
  index() {
    return {
      connectUrl: this.service.makeConnectUrl()
    };
  }

  @Get('connect')
  async connect(@Query(ConnectParamsPipe) query: ConnectParams | ErrorParams, @Res() res: Response) {
    if (query instanceof ErrorParams) {
      //TODO fix this on render. Still displays as htmlEncoded string
      res.render('error', query);
    } else if (query.decoupledId !== undefined) {
      res.render('delayed', await this.service.getDelayedVerificationsStatus(query.code, query.decoupledId));
    } else {
      res.render('connect', await this.service.connect(query.code));
    }
  }
}
