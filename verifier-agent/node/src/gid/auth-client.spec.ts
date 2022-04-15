import axiosMock from 'jest-mock-axios';

import { createMock } from '@golevelup/ts-jest';

import { GrantType } from '../types';
import { AuthClient, AuthToken } from './auth-client';

describe('AuthClient', () => {
  let client: AuthClient;

  const clientId = 'f64ebca2';
  const clientSecret = '8379881c';
  const accessToken = '09e9be92891e8cf7468a4d6f63d2daaf';
  const authTokenResponse = createMock<AuthToken>({
    access_token: accessToken
  });

  beforeEach(() => {
    client = new AuthClient(clientId, clientSecret);
    axiosMock.post.mockResolvedValueOnce({ data: authTokenResponse });
  });

  afterEach(() => {
    axiosMock.reset();
  });

  describe('getAppTokens', () => {
    it('should call auth service with client_credentials grant type', async () => {
      const result: string = await client.getAppAccessToken();

      expect(result).toBe(accessToken);
      expect(axiosMock.post).toHaveBeenCalledTimes(1);
      expect(axiosMock.post).toHaveBeenCalledWith('/v1/auth/token', {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: GrantType.ClientCredentials
      });
    });
  });
});
