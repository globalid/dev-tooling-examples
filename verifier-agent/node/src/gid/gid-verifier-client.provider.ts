import { Provider } from '@nestjs/common';
import { GidVerifierClient } from './gid-verifier-client';
import { GidVerifierClientFactory } from './gid-verifier-client.factory';

export const gidVerifierClientProvider: Provider<GidVerifierClient> = {
  provide: GidVerifierClient,
  useFactory: (gidVerifierClientFactory: GidVerifierClientFactory) => {
    return gidVerifierClientFactory.create();
  },
  inject: [GidVerifierClientFactory]
};
