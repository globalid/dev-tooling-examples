import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GidModule } from './gid/gid.module';

@Module({
  imports: [GidModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
