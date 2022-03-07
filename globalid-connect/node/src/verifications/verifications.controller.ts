import { Controller, Get, Param, Render } from '@nestjs/common';

import { VerificationsService } from './verifications.service';

@Controller('verifications')
export class VerificationsController {
  constructor(private readonly verificationsService: VerificationsService) {}

  @Get()
  @Render('verifications')
  index() {
    return {
      connectUrl: {
        href: this.verificationsService.makeConnectUrl()
      }
    };
  }

  @Get('connect')
  connect(@Param('code') code: string) {
    return this.verificationsService.connect(code);
  }
}
