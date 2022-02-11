import { Module } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { AttestationsController } from './attestations.controller';
import { AttestationsService } from './attestations.service';

@Module({
  controllers: [AttestationsController],
  providers: [AttestationsService, AuthService]
})
export class AttestationsModule {}
