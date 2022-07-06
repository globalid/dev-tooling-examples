import { createGidVerifierClient, GidVerifierClient } from '@globalid/verifier-toolkit';
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const gidVerifierClientProvider: Provider<GidVerifierClient> = {
  provide: GidVerifierClient,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    return createGidVerifierClient({
      clientId: configService.get('CLIENT_ID'),
      clientSecret: configService.get('CLIENT_SECRET')
    });
  }
};
