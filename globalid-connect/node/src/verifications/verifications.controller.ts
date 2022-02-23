import { Controller, Get, Logger, Render } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller('verifications')
export class VerificationsController {
  constructor(private readonly configService: ConfigService) {}

  private get attestationsConnectUrl(): string {
    return this.configService.get<string>('ATTESTATIONS_CONNECT_URL');
  }

  private get identityConnectUrl(): string {
    return this.configService.get<string>('IDENTITY_CONNECT_URL');
  }

  private get piiConnectUrl(): string {
    const value = this.configService.get<string>('PII_CONNECT_URL');
    const url = new URL(value);
    url.searchParams.set('nonce', `${Date.now()}`);
    return url.toString();
  }

  @Get()
  @Render('verifications')
  index() {    
    return {
      connectUrls: [
        {
          href: this.attestationsConnectUrl,
          label: 'Connect and get attestations'
        },
        {
          href: this.identityConnectUrl,
          label: 'Connect and get identity'
        },
        {
          href: this.piiConnectUrl,
          label: 'Connect and get PII'
        }
      ]
    };
  }
}
