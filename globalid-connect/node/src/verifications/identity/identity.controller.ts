import { Controller, Get, Query } from '@nestjs/common';
import { IdentityService } from './identity.service';

@Controller('verifications')
export class IdentityController {
    constructor(private readonly identity: IdentityService) {}

    @Get('connect/identity')
    getIdentity(@Query('code') code: string) {
      return this.identity.getIdentity(code);
    }
}
