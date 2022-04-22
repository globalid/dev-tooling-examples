import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // @Get()
  // async getQrCode(): Promise<string> {
  //   const qrCode = await this.appService.getQrCode();
  //   return `<img src=${qrCode} />`;
  // }
}
