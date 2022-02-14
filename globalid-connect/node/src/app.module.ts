import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { VerificationsModule } from './verifications/verifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    VerificationsModule
  ],
  controllers: [AppController],
  providers: []
})
export class AppModule {}
