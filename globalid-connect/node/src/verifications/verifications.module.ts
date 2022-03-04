import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { gidApiClientFactoryProvider } from './client/gid-api-client.factory';
import { NonceService } from './nonce.service';
import { VerificationsController } from './verifications.controller';
import { VerificationsService } from './verifications.service';

@Module({
  imports: [HttpModule],
  controllers: [VerificationsController],
  providers: [NonceService, VerificationsService, gidApiClientFactoryProvider]
})
export class VerificationsModule {}
