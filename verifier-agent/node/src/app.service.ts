import * as QRCode from 'qrcode';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { createPresentationRequestUrl } from './gid/create-presentation-request-url';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  async getPresentationRequestQrCode(trackingId: string): Promise<string> {
    const url = createPresentationRequestUrl({
      trackingId,
      clientId: this.configService.get<string>('CLIENT_ID'),
      initiationUrl: this.configService.get<string>('INITIATION_URL')
    });

    const qrCodeUrl = await QRCode.toDataURL(url.toString(), { scale: 10 });
    return qrCodeUrl;
  }
}
