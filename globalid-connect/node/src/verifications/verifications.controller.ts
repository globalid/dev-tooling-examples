import { Controller, Get, Query, Render } from '@nestjs/common';

import { ConnectParams } from './connect-params';
import { VerificationsService } from './verifications.service';

@Controller('verifications')
export class VerificationsController {
  constructor(private readonly verificationsService: VerificationsService) {}

  @Get()
  @Render('verifications')
  index() {
    return {
      connectUrl: this.verificationsService.makeConnectUrl()
    };
  }

  @Get('connect')
  @Render('connect')
  connect(@Query() query: ConnectParams) {
    if (query.decoupled_id === undefined) {
      return this.verificationsService.connect(query.code);
    } else {
      return this.verificationsService.getDelayedVerificationsStatus(query.code, query.decoupled_id);
    }
  }
}
