import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { VerificationsModule } from './verifications/verifications.module';
import { IdentityController } from './src/verifications/identity/identity/identity.controller';
import { IdentityController } from './src/verifications/identity/identity/identity.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    VerificationsModule
  ],
  controllers: [AppController, IdentityController],
  providers: []
})
export class AppModule {}
