import { createPresentationRequestUrl } from '@globalid/verifier-toolkit';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  async getPresentationRequestQrCode(trackingId: string): Promise<string> {
    const url = createPresentationRequestUrl({
      trackingId,
      clientId: this.configService.get<string>('CLIENT_ID'),
      initiationUrl: this.configService.get<string>('INITIATION_URL')
    });

    return url.toString();
  }
}
