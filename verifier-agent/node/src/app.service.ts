// This will not work with standard import. Perhaps there is a config that needs to be changed
// eslint-disable-next-line @typescript-eslint/no-var-requires
const QRCode = require('qrcode');

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

    const qrCodeUrl = await QRCode.toDataURL(url.toString());
    return qrCodeUrl;
  }
}
