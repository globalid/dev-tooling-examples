import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';

import { createMock } from '@golevelup/ts-jest';
import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';

import { tokens } from '../../../test/stubs';
import { AuthService } from '../auth/auth.service';
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
    it('should call vault with consent tokens', async () => {
      const consentTokens = createMock<string[]>();
      const encryptedPii = createMock<EncryptedPii[]>();
      const getTokensSpy = jest.spyOn(auth, 'getTokens').mockResolvedValueOnce(tokens);
      const postSpy = jest.spyOn(http, 'post').mockReturnValueOnce(
        new Observable((subscriber) => {
          subscriber.next(createMock<AxiosResponse<EncryptedPii[]>>({ data: encryptedPii }));
          subscriber.complete();
        })
      );

      const result = await service.getEncryptedData(consentTokens);

      expect(result).toBeDefined();
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
