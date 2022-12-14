import { Module } from '@nestjs/common';

import { ClientModule } from './client/client.module';
import { gidVerifierClientProvider } from './gid-verifier-client.provider';
import { PresentationRequestController } from './presentation-request.controller';
import { PresentationRequestService } from './presentation-request.service';
import { PresentationRequirementsFactory } from './factory/presentation-requirements.factory';
import { JsonPresentationRequirementsFactory } from './factory/json-presentation-requirements.factory';
import { AggregatePresentationRequirementsFactory } from './factory/aggregate-presentation-requirements.factory';
import { InMemoryPresentationRequirementsFactory } from './factory/in-memory-presentation-requirements.factory';

@Module({
  imports: [ClientModule],
  controllers: [PresentationRequestController],
  providers: [
    gidVerifierClientProvider,
    PresentationRequestService,
    InMemoryPresentationRequirementsFactory,
    JsonPresentationRequirementsFactory,
    { provide: PresentationRequirementsFactory, useClass: AggregatePresentationRequirementsFactory }
  ]
})
export class PresentationRequestModule {}
