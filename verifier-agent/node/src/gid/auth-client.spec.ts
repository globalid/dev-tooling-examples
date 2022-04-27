import axiosMock from 'jest-mock-axios';

import { createMock } from '@golevelup/ts-jest';

import { accessToken, clientId, clientSecret } from '../../test/common';
import { AuthClient, AuthToken, GrantType, tokenCache } from './auth-client';

describe('AuthClient', () => {
  let client: AuthClient;

  const authTokenResponse = createMock<AuthToken>({
    access_token: accessToken,
    expires_in: 28798
  });

  beforeEach(() => {
    jest.useFakeTimers();
    tokenCache.flushAll();
    client = new AuthClient(clientId, clientSecret);
    axiosMock.post.mockResolvedValue({ data: authTokenResponse });
  });

  afterEach(() => {
    jest.useRealTimers();
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

    it('should return access token from cache', async () => {
      await client.getAppAccessToken();
      const result: string = await client.getAppAccessToken();

      expect(result).toBe(accessToken);
      expect(axiosMock.post).toHaveBeenCalledTimes(1);
      expect(axiosMock.post).toHaveBeenCalledWith('/v1/auth/token', {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: GrantType.ClientCredentials
      });
    });

    it('should remove access token from cache when it expires', async () => {
      await client.getAppAccessToken();
      jest.advanceTimersByTime(authTokenResponse.expires_in * 1001);
      await client.getAppAccessToken();

      expect(axiosMock.post).toHaveBeenCalledTimes(2);
    });
  });
});
