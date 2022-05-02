import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { validate } from './config.schema';
import { GidModule } from './gid/gid.module';
import { CreatePresentationRequestDtoFactory } from './presentation-request/create-presentation-request-dto.factory';
import { PresentationRequestGateway } from './presentation-request/presentation-request.gateway';
import { PresentationRequirementsFactory } from './presentation-request/presentation-requirements.factory';
import { GidVerifierClientFactory } from './gid/gid-verifier-client.factory';
import { gidVerifierClientProvider } from './gid/gid-verifier-client.provider';
import { presentationRequestServiceProvider } from './presentation-request/presentation-request-service.provider';
import { PresentationRequestController } from './presentation-request/presentation-request.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate
    }),
    GidModule
  ],
  controllers: [AppController, PresentationRequestController],
  providers: [
    AppService,
    CreatePresentationRequestDtoFactory,
    GidVerifierClientFactory,
    gidVerifierClientProvider,
    presentationRequestServiceProvider,
    PresentationRequirementsFactory,
    PresentationRequestGateway
  ]
})
export class AppModule {}
