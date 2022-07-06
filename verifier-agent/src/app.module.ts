import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { validationSchema } from './config.schema';
import { PresentationRequestModule } from './presentation-request/presentation-request.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema
    }),
    PresentationRequestModule
  ]
})
export class AppModule {}
