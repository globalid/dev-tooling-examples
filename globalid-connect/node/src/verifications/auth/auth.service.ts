import axios from 'axios';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { GrantType } from './grant-type.enum';
import { TokensRequestOptions } from './token-request-options.interface';
import { Tokens } from './tokens.interface';

@Injectable()
export class AuthService {
  constructor(private readonly configService: ConfigService) {}

  private get clientId(): string {
    return this.configService.get<string>('CLIENT_ID');
  }

  private get clientSecret(): string {
    return this.configService.get<string>('CLIENT_SECRET');
  }

  async getTokens(options?: TokensRequestOptions): Promise<Tokens> {
    const grantType = options === undefined ? GrantType.ClientCredentials : GrantType.AuthorizationCode;
    const response = await axios.post<Tokens>('https://api.global.id/v1/auth/token', {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: grantType,
      code: options?.code,
      redirect_uri: options?.redirectUri
    });
    return response.data;
  }
}
