import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth/auth.service';
import { PiiController } from './pii/pii.controller';
import { PiiService } from './pii/pii.service';
import { VaultService } from './vault/vault.service';
import { VerificationsController } from './verifications.controller';
import { AttestationsService } from './attestations/attestations.service';
import { AttestationsController } from './attestations/attestations.controller';

@Module({
  imports: [HttpModule],
  controllers: [AttestationsController, PiiController, VerificationsController],
  providers: [AttestationsService, AuthService, ConfigService, PiiService, VaultService]
})
export class VerificationsModule {}
