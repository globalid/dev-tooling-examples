import { Controller, Get, Param, Render } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NonceService } from './nonce.service';
import { VerificationsService } from './verifications.service';

@Controller('verifications')
export class VerificationsController {
  constructor(
    private readonly configService: ConfigService,
    private readonly nonceService: NonceService,
    private readonly verificationsService: VerificationsService
  ) {}

  private get piiConnectUrl(): string {
    const value = this.configService.get<string>('CONNECT_URL');
    const url = new URL(value);
    const nonce: string = this.nonceService.generate();
    url.searchParams.set('nonce', `${nonce}`);
    return url.toString();
  }

  @Get()
  @Render('verifications')
  index() {
    return {
      connectUrls: [
        {
          href: this.configService.get<string>('CONNECT_URL'),
          label: 'Connect'
        },
        {
          href: this.piiConnectUrl,
          label: 'Connect and get PII'
        }
      ]
    };
  }

  @Get('connect')
  connect(@Param('code') code: string) {
    return this.verificationsService.connect(code);
  }
}
