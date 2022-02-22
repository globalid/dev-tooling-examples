import { createMock } from '@golevelup/ts-jest';
import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';

import { appTokens, code, spyOnHttpPost, userTokens } from '../../../test/common';
import { AuthService } from './auth.service';
import { GrantType } from './grant-type.enum';

describe('AuthService', () => {
  let service: AuthService;
  let http: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ providers: [AuthService] })
      .useMocker(createMock)
      .compile();

    service = module.get(AuthService);
    http = module.get(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getTokens', () => {
    it('should use client credentials flow when given no options', async () => {
      const postSpy = spyOnHttpPost(http, appTokens);

      const result = await service.getTokens();

      expect(result).toBe(appTokens);
      expect(postSpy).toHaveBeenCalledTimes(1);
      expect(postSpy).toHaveBeenCalledWith('https://api.global.id/v1/auth/token', {
        client_id: service.clientId,
        client_secret: service.clientSecret,
        grant_type: GrantType.ClientCredentials
      });
    });

    it('should use authorization code flow when given options', async () => {
      const redirectUri = 'https://example.com/redirect';
      const postSpy = spyOnHttpPost(http, userTokens);

      const result = await service.getTokens({ code, redirectUri });

      expect(result).toBe(userTokens);
      expect(postSpy).toHaveBeenCalledTimes(1);
      expect(postSpy).toHaveBeenCalledWith('https://api.global.id/v1/auth/token', {
        code,
        redirect_uri: redirectUri,
        client_id: service.clientId,
        client_secret: service.clientSecret,
        grant_type: GrantType.AuthorizationCode
      });
    });
  });
});
