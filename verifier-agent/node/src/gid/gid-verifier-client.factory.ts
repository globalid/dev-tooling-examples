import { createGidVerifierClient, GidVerifierClient } from '@globalid/verifier-toolkit';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GidVerifierClientFactory {
  constructor(private readonly configService: ConfigService) {}

  create(): GidVerifierClient {
    return createGidVerifierClient({
      clientId: this.configService.get<string>('CLIENT_ID'),
      clientSecret: this.configService.get<string>('CLIENT_SECRET')
    });
  }
}
