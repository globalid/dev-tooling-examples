import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';

import { IdentityService } from './identity.service';
import { AuthService } from '../auth/auth.service';
import { accessToken, code, spyOnHttpGet } from '../../../test/common';
import { Identity } from './identity.interface';
import { Tokens } from '../auth/tokens.interface';

describe('IdentityService', () => {
  let service: IdentityService;
  let authService: AuthService;
  let http: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IdentityService]
    })
      .useMocker(createMock)
      .compile();

    service = module.get<IdentityService>(IdentityService);
    authService = module.get(AuthService);
    http = module.get(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getIdentity', () => {
    it("should return user's identity", async () => {
      const identity = createMock<Identity>();
      const getTokensSpy = jest
        .spyOn(authService, 'getTokens')
        .mockResolvedValueOnce(createMock<Tokens>({ access_token: accessToken }));
      const getSpy = spyOnHttpGet(http, identity);
      const result = await service.getIdentity(code);

      expect(getTokensSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          code
        })
      );

      expect(getSpy).toHaveBeenCalledTimes(1);

      expect(getSpy).toHaveBeenCalledWith('https://api.global.id/v1/identity/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      expect(result).toBe(identity);
    });
  });
});
