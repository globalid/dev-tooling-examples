import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GidVerifierClient } from './gid-verifier-client';
import { PresentationRequestService } from '../presentation-request/presentation-request.service';
import { PresentationRequirementsFactory } from '../presentation-request/presentation-requirements.factory';
import { GidVerifierClientFactory } from './gid-verifier-client.factory';

export const gidVerifierClientProvider: Provider<GidVerifierClient> = {
  provide: GidVerifierClient,
  useFactory: (gidVerifierClientFactory: GidVerifierClientFactory) => {
    return gidVerifierClientFactory.create();
  },
  inject: [GidVerifierClientFactory]
};

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
