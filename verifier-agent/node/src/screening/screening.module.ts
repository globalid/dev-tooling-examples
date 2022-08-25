import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ScreeningClaim } from './screening-claim.entity';
import { ScreeningController } from './screening.controller';
import { Screening } from './screening.entity';
import { ScreeningService } from './screening.service';

@Module({
  imports: [TypeOrmModule.forFeature([Screening, ScreeningClaim])],
  controllers: [ScreeningController],
  providers: [ScreeningService],
  exports: [ScreeningService]
})
export class ScreeningModule {}
