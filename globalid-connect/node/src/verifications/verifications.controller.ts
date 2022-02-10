import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller('verifications')
export class VerificationsController {
  constructor(private readonly configService: ConfigService) {}

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
}
