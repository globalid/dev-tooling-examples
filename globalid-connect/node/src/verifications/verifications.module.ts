import { Module } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { PiiController } from './pii/pii.controller';
import { PiiService } from './pii/pii.service';
import { VaultService } from './vault/vault.service';
import { VerificationsController } from './verifications.controller';
import { IdentityService } from './identity/identity.service';
import { AttestationsService } from './attestations/attestations.service';
import { AttestationsController } from './attestations/attestations.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [AttestationsController, PiiController, VerificationsController],
  providers: [AttestationsService, AuthService, PiiService, VaultService, IdentityService]
})
export class VerificationsModule {}
