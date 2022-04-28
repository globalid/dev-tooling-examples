import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import validationSchema from './config.schema';
import { GidModule } from './gid/gid.module';
import { CreatePresentationRequestDtoFactory } from './presentation-request/create-presentation-request-dto.factory';
import { PresentationRequestGateway } from './presentation-request/presentation-request.gateway';
import { PresentationRequirementsFactory } from './presentation-request/presentation-requirements.factory';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema
    }),
    GidModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    CreatePresentationRequestDtoFactory,
    PresentationRequirementsFactory,
    PresentationRequestGateway
  ]
})
export class AppModule {}
