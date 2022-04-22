// This will not work with standard import. Perhaps there is a config that needs to be changed
// eslint-disable-next-line @typescript-eslint/no-var-requires
const QRCode = require('qrcode');

import { Injectable } from '@nestjs/common';

import { createPresentationRequestUrl } from './gid/createPresentationRequestUrl';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async getQrCode(): Promise<string> {
    const [url] = createPresentationRequestUrl({
      clientId: '1234',
      initiationUrl: 'https://www.localhost.com:3000'
    });
    const qrCodeUrl = await QRCode.toDataURL(url.toString());
    return qrCodeUrl;
  }
}
