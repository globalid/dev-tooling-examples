import { createGidVerifierClient, GidVerifierClient } from '@globalid/verifier-toolkit';
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const gidVerifierClientProvider: Provider<GidVerifierClient> = {
  provide: GidVerifierClient,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const client = createGidVerifierClient({
      clientId: configService.get('CLIENT_ID'),
      clientSecret: configService.get('CLIENT_SECRET')
    });

    client.setAppUuid(configService.get('APP_UUID'));

    return client;
  }
};
