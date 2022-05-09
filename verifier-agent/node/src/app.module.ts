import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { validate } from './config.schema';
import { GidModule } from './gid/gid.module';
import { CreatePresentationRequestDtoFactory } from './presentation-request/create-presentation-request-dto.factory';
import { PresentationRequestController } from './presentation-request/presentation-request.controller';
import { PresentationRequestGateway } from './presentation-request/presentation-request.gateway';
import { PresentationRequestService } from './presentation-request/presentation-request.service';
import { PresentationRequirementsFactory } from './presentation-request/presentation-requirements.factory';

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
    PresentationRequestService,
    PresentationRequirementsFactory,
    PresentationRequestGateway
  ]
})
export class AppModule {}
