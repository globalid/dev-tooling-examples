import { randomUUID } from 'crypto';

import { Controller, Get, Render } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  async renderHomeView(): Promise<Record<string, any>> {
    const trackingId = randomUUID();
    const qrCodeURL = await this.appService.getPresentationRequestQrCode(trackingId);

    return { trackingId, qrCodeURL };
  }
}
