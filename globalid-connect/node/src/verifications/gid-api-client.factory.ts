import { GidApiClientFactory } from '@globalid/api-client';
import { ConfigService } from '@nestjs/config';

export const gidApiClientFactoryProvider = {
  provide: GidApiClientFactory,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) =>
    new GidApiClientFactory({
      clientId: configService.get<string>('CLIENT_ID'),
      clientSecret: configService.get<string>('CLIENT_SECRET'),
      redirectUri: configService.get<string>('REDIRECT_URI'),
      privateKey: {
        key: configService.get<string>('PRIVATE_KEY'),
        passphrase: configService.get<string>('PRIVATE_KEY_PASSPHRASE')
      }
    })
};
