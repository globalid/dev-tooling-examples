import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VerificationsModule } from './verifications/verifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    VerificationsModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
