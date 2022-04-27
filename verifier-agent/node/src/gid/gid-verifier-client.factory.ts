import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createGidVerifierClient } from './create-gid-verifier-client';
import { GidVerifierClient } from './gid-verifier-client';

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
