import { AxiosResponse } from 'axios';
import * as NodeCache from 'node-cache';

import { apiAxios as axios } from './axios';

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

export const tokenCache = new NodeCache();
export class AuthClient {
  constructor(private readonly clientId: string, private readonly clientSecret: string) {}

  async getAppAccessToken(): Promise<string> {
    const key = this.clientId + this.clientSecret
    const accessToken: string | undefined = tokenCache.get(key)
    if(accessToken !== undefined) {
      return accessToken;
    }
    const response: AxiosResponse<AuthToken, any> = await axios.post('/v1/auth/token', {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: GrantType.ClientCredentials
    });
    tokenCache.set(key, response.data.access_token, response.data.expires_in);
    return response.data.access_token;
  }
}
