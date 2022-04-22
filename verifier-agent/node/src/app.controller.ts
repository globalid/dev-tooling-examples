import { randomUUID } from 'crypto';

import { Controller, Get, Render } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  renderHomeView(): Record<string, any> {
    const trackingId = randomUUID();
    const qrCode = this.appService.getPresentationRequestQrCode(trackingId);

    return { trackingId, qrCode };
  }
}
