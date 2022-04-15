import axiosMock from 'jest-mock-axios';

import { createMock } from '@golevelup/ts-jest';

import { AuthClient, AuthToken, GrantType } from './auth-client';
import { accessToken, clientId, clientSecret } from '../../test/common';

describe('AuthClient', () => {
  let client: AuthClient;

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
