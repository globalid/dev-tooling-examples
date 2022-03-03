import { Controller, Get, Param, Render } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { VerificationsService } from './verifications.service';

@Controller('verifications')
export class VerificationsController {
  constructor(
    private readonly configService: ConfigService,
    private readonly verificationsService: VerificationsService
  ) {}

  @Get()
  @Render('verifications')
  index() {
    return {
      connectUrls: [
        {
          href: this.configService.get<string>('CONNECT_URL'),
          label: 'Connect'
        }
      ]
    };
  }

  @Get('connect')
  connect(@Param('code') code: string) {
    return this.verificationsService.connect(code);
  }
}
