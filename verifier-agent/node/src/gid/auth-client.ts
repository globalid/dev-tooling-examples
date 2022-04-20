import { AxiosResponse } from 'axios';

import axios from './axios';

export enum GrantType {
  ClientCredentials = 'client_credentials'
}

export interface AuthToken {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
  id_token?: string;
  refresh_token?: string;
}

export class AuthClient {
  constructor(private readonly clientId: string, private readonly clientSecret: string) {}

  async getAppAccessToken(): Promise<string> {
    const response: AxiosResponse<AuthToken, any> = await axios.post(
      '/v1/auth/token',
      {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: GrantType.ClientCredentials
      },
      {
        baseURL: process.env.GID_API_BASE_URL || 'https://api.global.id'
      }
    );
    return response.data.access_token;
  }
}
