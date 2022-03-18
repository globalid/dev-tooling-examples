import { Response } from 'express';

import { Controller, Get, Query, Render, Res } from '@nestjs/common';

import { ConnectParams } from './connect-params';
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
  async connect(@Query() query: ConnectParams, @Res() res: Response) {
    if (query.decoupled_id === undefined) {
      res.render('connect', await this.service.connect(query.code));
    } else {
      res.render('delayed', await this.service.getDelayedVerificationsStatus(query.code, query.decoupled_id));
    }
  }
}
