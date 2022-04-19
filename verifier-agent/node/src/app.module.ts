import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import validationSchema from './config.schema';
import { GidModule } from './gid/gid.module';
import { PresentationRequestGateway } from './presentationRequest/presentation-request.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema
    }),
    PresentationRequestGateway,
    GidModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
