import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { validate } from './config.schema';
import { GidModule } from './gid/gid.module';
import { CreatePresentationRequestDtoFactory } from './presentation-request/create-presentation-request-dto.factory';
import { PresentationRequestGateway } from './presentation-request/presentation-request.gateway';
import { PresentationRequirementsFactory } from './presentation-request/presentation-requirements.factory';
import { gidVerifierClientProvider, presentationRequestServiceProvider } from './gid/provider-factories';
import { GidVerifierClientFactory } from './gid/gid-verifier-client.factory';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate
    }),
    PresentationRequestGateway,
    GidModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    CreatePresentationRequestDtoFactory,
    GidVerifierClientFactory,
    gidVerifierClientProvider,
    presentationRequestServiceProvider,
    PresentationRequirementsFactory
  ]
})
export class AppModule {}
