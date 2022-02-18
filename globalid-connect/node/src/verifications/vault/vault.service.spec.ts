import { createMock } from '@golevelup/ts-jest';
import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';

import { accessToken, encryptedAttachment, privateFileToken, spyOnHttpGet, spyOnHttpPost } from '../../../test/common';
import { EncryptedPii } from './encrypted-pii.interface';
import { VaultService } from './vault.service';

describe('VaultService', () => {
  let service: VaultService;
  let http: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ providers: [VaultService] })
      .useMocker(createMock)
      .compile();

    service = module.get(VaultService);
    http = module.get(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getEncryptedData', () => {
    it('should call vault with consent tokens', async () => {
      const consentTokens = createMock<string[]>();
      const encryptedPii = createMock<EncryptedPii[]>();
      const postSpy = spyOnHttpPost(http, encryptedPii);

      const result = await service.getEncryptedData(consentTokens, accessToken);

      expect(result).toBe(encryptedPii);
      expect(postSpy).toHaveBeenCalledTimes(1);
      expect(postSpy).toHaveBeenCalledWith(
        'https://api.global.id/v1/vault/get-encrypted-data',
        { private_data_tokens: consentTokens },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );
    });
  });

  describe('getAttachment', () => {
    it('should return attachment as a Buffer', async () => {
      const getSpy = spyOnHttpGet(http, encryptedAttachment);

      const result = await service.getAttachment(privateFileToken, accessToken);

      expect(result).toBe(encryptedAttachment);
      expect(getSpy).toHaveBeenCalledTimes(1);
      expect(getSpy).toHaveBeenCalledWith(`https://api.global.id/v1/vault/attachment/${privateFileToken}/client`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        responseType: 'arraybuffer'
      });
    });
  });
});
