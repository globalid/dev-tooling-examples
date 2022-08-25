import { ScreeningModule } from 'src/screening/screening.module';

import { Module } from '@nestjs/common';

import { ClientModule } from './client/client.module';
import { gidVerifierClientProvider } from './gid-verifier-client.provider';
import { PresentationRequestController } from './presentation-request.controller';
import { PresentationRequestService } from './presentation-request.service';
import { PresentationRequirementsFactory } from './presentation-requirements.factory';

@Module({
  imports: [ClientModule, ScreeningModule],
  controllers: [PresentationRequestController],
  providers: [gidVerifierClientProvider, PresentationRequestService, PresentationRequirementsFactory]
})
export class PresentationRequestModule {}
