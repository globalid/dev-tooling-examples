import { Controller, Get, Logger, Redirect } from '@nestjs/common';
import { configValidationStructure } from './config';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);
  
  @Get()
  @Redirect('/verifications')
  index() {
    // no action required
  }
}
