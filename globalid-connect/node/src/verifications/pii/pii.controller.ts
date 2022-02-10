import { Controller, Get, Query } from '@nestjs/common';

import { PiiService } from './pii.service';

@Controller('verifications')
export class PiiController {
  constructor(private readonly piiService: PiiService) {}

  @Get('connect/pii')
  index(@Query('code') code: string) {
    return this.piiService.get(code);
  }
}
