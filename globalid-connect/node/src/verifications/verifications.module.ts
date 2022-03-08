import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { gidApiClientFactoryProvider } from './gid-api-client.factory';
import { NonceService } from './nonce.service';
import { ResultsController } from './results/results.controller';
import { VerificationsController } from './verifications.controller';
import { VerificationsService } from './verifications.service';

@Module({
  imports: [HttpModule],
  controllers: [VerificationsController, ResultsController],
  providers: [NonceService, VerificationsService, gidApiClientFactoryProvider]
})
export class VerificationsModule {}
