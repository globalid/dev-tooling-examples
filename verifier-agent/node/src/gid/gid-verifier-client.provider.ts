import { GidVerifierClient, createGidVerifierClient } from '@globalid/verifier-toolkit';
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const gidVerifierClientProvider: Provider<GidVerifierClient> = {
  provide: GidVerifierClient,
  useFactory: (configService: ConfigService) => {
    return createGidVerifierClient({
      clientId: '1234',
      clientSecret: 'asdf'
    });
  },
  inject: [ConfigService]
};
