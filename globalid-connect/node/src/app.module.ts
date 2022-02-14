import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { VerificationsModule } from './verifications/verifications.module';
import { AttestationsController } from './attestations/attestations.controller';
import { AttestationsModule } from './attestations/attestations.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    VerificationsModule,
    AttestationsModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: []
})
export class AppModule {}
