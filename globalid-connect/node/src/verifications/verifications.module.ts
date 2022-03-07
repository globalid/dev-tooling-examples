import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { PiiController } from './pii/pii.controller';
import { PiiService } from './pii/pii.service';
import { VaultService } from './vault/vault.service';
import { VerificationsController } from './verifications.controller';
import { IdentityService } from './identity/identity.service';
import { IdentityController } from './identity/identity.controller';
import { AttestationsService } from './attestations/attestations.service';
import { AttestationsController } from './attestations/attestations.controller';
import { NonceService } from './nonce.service';
import { ResultsController } from './results/results.controller';

@Module({
  imports: [HttpModule],
  controllers: [AttestationsController, PiiController, VerificationsController, IdentityController, ResultsController],
  providers: [AttestationsService, AuthService, PiiService, VaultService, IdentityService, NonceService]
})
export class VerificationsModule {}
