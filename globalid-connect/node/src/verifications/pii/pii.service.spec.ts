import { createMock } from '@golevelup/ts-jest';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import {
  accessToken,
  attachmentContents,
  code,
  configServiceMock,
  consentTokens,
  encryptedAttachment,
  encryptedPii,
  idToken,
  pii,
  privateFileToken
} from '../../../test/common';
import { AuthService } from '../auth/auth.service';
import { Tokens } from '../auth/tokens.interface';
import { VaultService } from '../vault/vault.service';
import { MissingIdTokenError } from './missing-id-token.error';
import { PiiService } from './pii.service';

describe('PiiService', () => {
  let service: PiiService;
  let auth: AuthService;
  let vault: VaultService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PiiService, { provide: ConfigService, useValue: configServiceMock }]
    })
      .useMocker(createMock)
      .compile();

    service = module.get(PiiService);
    auth = module.get(AuthService);
    vault = module.get(VaultService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('get', () => {
    it('should retrieve and decrypt PII', async () => {
      const getTokensSpy = jest
        .spyOn(auth, 'getTokens')
        .mockResolvedValueOnce(createMock<Tokens>({ id_token: idToken }))
        .mockResolvedValueOnce(createMock<Tokens>({ access_token: accessToken }));
      const getEncryptedDataSpy = jest.spyOn(vault, 'getEncryptedData').mockResolvedValueOnce(encryptedPii);
      const getAttachmentSpy = jest.spyOn(vault, 'getAttachment').mockResolvedValueOnce(encryptedAttachment);

      const result = await service.get(code);

      expect(result).toStrictEqual([{ ...pii, attachment: attachmentContents.toString('base64') }]);
      expect(getTokensSpy).toHaveBeenCalledTimes(2);
      expect(getTokensSpy).toHaveBeenNthCalledWith(1, expect.objectContaining({ code }));
      expect(getTokensSpy).toHaveBeenNthCalledWith(2);
      expect(getEncryptedDataSpy).toHaveBeenCalledTimes(1);
      expect(getEncryptedDataSpy).toHaveBeenCalledWith(consentTokens, accessToken);
      expect(getAttachmentSpy).toHaveBeenCalledTimes(1);
      expect(getAttachmentSpy).toHaveBeenCalledWith(privateFileToken, accessToken);
    });

    it('should throw error when ID token is missing from user tokens', async () => {
      jest.spyOn(auth, 'getTokens').mockResolvedValueOnce(createMock<Tokens>({ id_token: undefined }));

      await expect(() => service.get(code)).rejects.toThrow(MissingIdTokenError);
    });
  });
});
