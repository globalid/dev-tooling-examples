import { Module } from '@nestjs/common';

import { AuthService } from './auth/auth.service';
import { PiiService } from './pii/pii.service';
import { VaultService } from './vault/vault.service';
import { VerificationsController } from './verifications.controller';
import { VerificationsService } from './verifications.service';

@Module({
  controllers: [VerificationsController],
  providers: [AuthService, PiiService, VaultService, VerificationsService]
})
export class VerificationsModule {}
