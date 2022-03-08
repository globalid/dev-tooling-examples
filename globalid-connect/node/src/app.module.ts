import { join } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';

import { AppController } from './app.controller';
import validationSchema from './config.schema';
import { VerificationsModule } from './verifications/verifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema
    }),
    VerificationsModule
  ],
  controllers: [AppController],
  providers: []
})
export class AppModule {}
