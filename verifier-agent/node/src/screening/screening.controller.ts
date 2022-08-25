import { Controller, Get, Param, ParseIntPipe, Render } from '@nestjs/common';

import { ScreeningService } from './screening.service';

@Controller('screenings')
export class ScreeningController {
  constructor(private readonly service: ScreeningService) {}

  @Get()
  @Render('screenings')
  async getAll() {
    return {
      screenings: await this.service.findAll()
    };
  }

  @Get(':id')
  @Render('screening')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }
}
