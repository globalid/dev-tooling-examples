import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GidModule } from './gid/gid.module';
import { PresentationRequestGateway } from './presentationRequest/presentation-request.gateway';

@Module({
  imports: [GidModule, PresentationRequestGateway],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
