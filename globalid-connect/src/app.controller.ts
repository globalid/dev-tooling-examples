import { Controller, Get, Redirect } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  @Redirect('/verifications')
  index() {
    // no action required
  }
}
