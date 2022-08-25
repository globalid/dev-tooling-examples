import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { validationSchema } from './config.schema';
import { PresentationRequestModule } from './presentation-request/presentation-request.module';
import { ScreeningModule } from './screening/screening.module';
import { TypeOrmModuleOptionsFactory } from './type-orm-module-options.factory';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema
    }),
    PresentationRequestModule,
    ScreeningModule,
    TypeOrmModule.forRootAsync({ useClass: TypeOrmModuleOptionsFactory })
  ]
})
export class AppModule {}
