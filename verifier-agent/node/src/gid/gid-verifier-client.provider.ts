import { GidVerifierClient } from '@globalid/verifier-toolkit';
import { Provider } from '@nestjs/common';

import { GidVerifierClientFactory } from './gid-verifier-client.factory';

export const gidVerifierClientProvider: Provider<GidVerifierClient> = {
  provide: GidVerifierClient,
  useFactory: (gidVerifierClientFactory: GidVerifierClientFactory) => {
    return gidVerifierClientFactory.create();
  },
  inject: [GidVerifierClientFactory]
};
