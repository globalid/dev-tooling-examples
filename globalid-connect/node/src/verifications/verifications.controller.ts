import { Controller, Get, Param, Render } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NonceService } from './nonce.service';
import { VerificationsService } from './verifications.service';

@Controller('verifications')
export class VerificationsController {
  constructor(private readonly verificationsService: VerificationsService) {}

  @Get()
  @Render('verifications')
  index() {
    return {
      connectUrl: {
        href: this.verificationsService.connectUrl,
        label: 'Connect'
      }
    };
  }

  @Get('connect')
  connect(@Param('code') code: string) {
    return this.verificationsService.connect(code);
  }
}
