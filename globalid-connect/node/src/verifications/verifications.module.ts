import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { gidApiClientFactoryProvider } from './gid-api-client-factory.provider';
import { NonceService } from './nonce.service';
import { VerificationsController } from './verifications.controller';
import { VerificationsService } from './verifications.service';

@Module({
  imports: [HttpModule],
  controllers: [VerificationsController],
  providers: [gidApiClientFactoryProvider, NonceService, VerificationsService]
})
export class VerificationsModule {}
