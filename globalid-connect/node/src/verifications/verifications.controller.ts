import { Controller, Get, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { VerificationsService } from './verifications.service';

@Controller('verifications')
export class VerificationsController {
  constructor(
    private readonly configService: ConfigService,
    private readonly verificationsService: VerificationsService
  ) {}

  private get connectUrl(): URL {
    const url = this.configService.get<string>('CONNECT_URL');
    return new URL(url);
  }

  @Get()
  index() {
    const url = this.connectUrl;
    url.searchParams.set('nonce', `${Date.now()}`);
    return `<a href="${url}">Connect with GlobaliD</a>`;
  }

  @Get('connect/pii')
  getPii(@Query('code') code: string) {
    return this.verificationsService.getPii(code);
  }
}
