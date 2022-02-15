import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { AuthService } from './auth/auth.service';
import { PiiController } from './pii/pii.controller';
import { PiiService } from './pii/pii.service';
import { VaultService } from './vault/vault.service';
import { VerificationsController } from './verifications.controller';
import { IdentityService } from './identity/identity.service';

@Module({
  imports: [HttpModule],
  controllers: [PiiController, VerificationsController],
  providers: [AuthService, PiiService, VaultService, IdentityService]
})
export class VerificationsModule {}
