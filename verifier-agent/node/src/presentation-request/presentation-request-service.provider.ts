import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GidVerifierClient } from '../gid/gid-verifier-client';
import { PresentationRequestService } from './presentation-request.service';
import { PresentationRequirementsFactory } from './presentation-requirements.factory';

export const presentationRequestServiceProvider: Provider<PresentationRequestService> = {
  provide: PresentationRequestService,
  useFactory: (
    configService: ConfigService,
    gidVerifierClient: GidVerifierClient,
    presentationRequirementsFactory: PresentationRequirementsFactory
  ) => {
    return new PresentationRequestService(configService, gidVerifierClient, presentationRequirementsFactory);
  },
  inject: [ConfigService, GidVerifierClient, PresentationRequirementsFactory]
};
