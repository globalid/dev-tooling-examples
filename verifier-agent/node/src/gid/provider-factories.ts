import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthClient } from './auth-client';
import { EpamClient } from './epam-client';
import { GidVerifierClient } from './gid-verifier-client';
import { PresentationRequestService } from '../presentation-request/presentation-request.service';
import { PresentationRequirementsFactory } from '../presentation-request/presentation-requirements.factory';

export const epamClientProviderFactory: Provider<EpamClient> = {
  provide: EpamClient,
  useFactory: (configService: ConfigService) => {
    const authClient = new AuthClient(
      configService.get<string>('CLIENT_ID'),
      configService.get<string>('CLIENT_SECRET')
    );
    return new EpamClient(authClient);
  },
  inject: [ConfigService]
};

export const gidVerifierClientProviderFactory: Provider<GidVerifierClient> = {
  provide: GidVerifierClient,
  useFactory: (epamClient: EpamClient) => {
    return new GidVerifierClient(epamClient);
  },
  inject: [EpamClient]
};

export const presentationRequestServiceProviderFactory: Provider<PresentationRequestService> = {
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
