import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import config, { validationSchema } from './config';
import { VerificationsModule } from './verifications/verifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      validationSchema: validationSchema
    }),
    VerificationsModule
  ],
  controllers: [AppController],
  providers: []
})
export class AppModule {}
