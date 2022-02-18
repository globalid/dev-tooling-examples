import { Controller, Get, Query } from '@nestjs/common';
import { IdentityService } from './identity.service';

@Controller('verifications')
export class IdentityController {
  constructor(private readonly identityService: IdentityService) {}

  @Get('connect/identity')
  getIdentity(@Query('code') code: string) {
    return this.identityService.getIdentity(code);
  }
}
