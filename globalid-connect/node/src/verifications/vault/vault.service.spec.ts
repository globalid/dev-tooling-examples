import { createMock } from '@golevelup/ts-jest';
import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';

import { accessToken, spyOnHttpPost } from '../../../test/common';
import { AuthService } from '../auth/auth.service';
import { Tokens } from '../auth/tokens.interface';
import { EncryptedPii } from './encrypted-pii.interface';
import { VaultService } from './vault.service';

describe('VaultService', () => {
  let service: VaultService;
  let auth: AuthService;
  let http: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ providers: [VaultService] })
      .useMocker(createMock)
      .compile();

    service = module.get(VaultService);
    auth = module.get(AuthService);
    http = module.get(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getEncryptedData', () => {
     const tokens: Tokens = {
      access_token: accessToken,
      expires_in: 12345,
      scope: 'openid',
      token_type: 'foo'
    };

    it('should call vault with consent tokens', async () => {
      const consentTokens = createMock<string[]>();
      const encryptedPii = createMock<EncryptedPii[]>();
      const getTokensSpy = jest.spyOn(auth, 'getTokens').mockResolvedValueOnce(tokens);
      const postSpy = spyOnHttpPost(http, encryptedPii);

      const result = await service.getEncryptedData(consentTokens);

      expect(result).toBe(encryptedPii);
      expect(getTokensSpy).toHaveBeenCalledTimes(1);
      expect(getTokensSpy).toHaveBeenCalledWith();
      expect(postSpy).toHaveBeenCalledTimes(1);
      expect(postSpy).toHaveBeenCalledWith(
        'https://api.global.id/v1/vault/get-encrypted-data',
        { private_data_tokens: consentTokens },
        {
          headers: {
            Authorization: `Bearer ${tokens.access_token}`
          }
        }
      );
    });
  });
});
