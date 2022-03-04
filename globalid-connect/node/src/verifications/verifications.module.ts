import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { gidApiClientFactoryService } from './client/gid-api-client-factory.service';
import { NonceService } from './nonce.service';
import { VerificationsController } from './verifications.controller';
import { VerificationsService } from './verifications.service';

@Module({
  imports: [HttpModule],
  controllers: [VerificationsController],
  providers: [NonceService, VerificationsService, gidApiClientFactoryService]
})
export class VerificationsModule {}
