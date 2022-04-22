import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { createPresentationRequestUrl } from './gid/create-presentation-request-url';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  getPresentationRequestQrCode(trackingId: string): string {
    const url = createPresentationRequestUrl({
      trackingId,
      clientId: this.configService.get<string>('CLIENT_ID'),
      initiationUrl: this.configService.get<string>('INITIATION_URL')
    });

    //TODO return actual QRCode once PR has been merged.

    return url.toString();
  }
}
