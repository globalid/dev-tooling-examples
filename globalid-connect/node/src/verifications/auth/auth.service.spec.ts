import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';

import { createMock } from '@golevelup/ts-jest';
import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';

import { accessToken, code } from '../../../test/stubs';
import { AuthService } from './auth.service';
import { GrantType } from './grant-type.enum';
import { Tokens } from './tokens.interface';

describe('AuthService', () => {
  let http: HttpService;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ providers: [AuthService] })
      .useMocker(createMock)
      .compile();

    http = module.get(HttpService);
    service = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getTokens', () => {
    const tokens: Tokens = {
      access_token: accessToken,
      expires_in: 12345,
      scope: 'openid',
      token_type: 'foo'
    };
    let postSpy: jest.SpyInstance;

    beforeEach(() => {
      postSpy = jest.spyOn(http, 'post').mockReturnValueOnce(
        new Observable((subscriber) => {
          subscriber.next(createMock<AxiosResponse<Tokens>>({ data: tokens }));
          subscriber.complete();
        })
      );
    });

    it('should use client credentials flow when given no options', async () => {
      const result = await service.getTokens();

      expect(result).toBe(tokens);
      expect(postSpy).toHaveBeenCalledTimes(1);
      expect(postSpy).toHaveBeenCalledWith('https://api.global.id/v1/auth/token', {
        client_id: service.clientId,
        client_secret: service.clientSecret,
        grant_type: GrantType.ClientCredentials
      });
    });

    it('should use authorization code flow when given options', async () => {
      const redirectUri = 'https://example.com/redirect';

      const result = await service.getTokens({ code, redirectUri });

      expect(result).toBe(tokens);
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
