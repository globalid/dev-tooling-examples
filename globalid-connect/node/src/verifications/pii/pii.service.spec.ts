import * as crypto from 'crypto';
import { AES, RSA } from 'globalid-crypto-library';
import * as jwt from 'jsonwebtoken';

import { createMock } from '@golevelup/ts-jest';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { accessToken, attachmentContents, code } from '../../../test/common';
import { AuthService } from '../auth/auth.service';
import { Tokens } from '../auth/tokens.interface';
import { EncryptedPii } from '../vault/encrypted-pii.interface';
import { VaultService } from '../vault/vault.service';
import { MissingIdTokenError } from './missing-id-token.error';
import { Pii } from './pii.interface';
import { PiiService } from './pii.service';

const redirectUri = 'http://localhost:3000/verifications/pii';

const { public_key: publicKey, private_key: privateKey, passphrase } = RSA.generateKeyPair(4096);
const consentTokens = ['foo', 'bar', 'baz'];
const idToken = jwt.sign(
  {
    'idp.globalid.net/claims/acrc_id': {
      consentId1: [RSA.encrypt(publicKey, consentTokens[0])],
      consentId2: [RSA.encrypt(publicKey, consentTokens[1])],
      consentId3: [RSA.encrypt(publicKey, consentTokens[2])]
    }
  },
  privateKey
);

describe('PiiService', () => {
  let service: PiiService;
  let auth: AuthService;
  let vault: VaultService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PiiService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'PRIVATE_KEY') return privateKey;
              if (key === 'PRIVATE_KEY_PASSPHRASE') return passphrase;
              if (key === 'PII_REDIRECT_URI') return redirectUri;
            })
          }
        }
      ]
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
      const password = crypto.randomBytes(32).toString('hex');
      const pii: Pii = {
        attestation_request_uuid: 'request-uuid',
        gid_uuid: 'gid-uuid',
        type: 'name',
        value: 'foo',
        has_attachment: true
      };
      const privateFileToken = 'foo';
      const encryptedPii: EncryptedPii = {
        encrypted_data_password: RSA.encrypt(publicKey, password),
        encrypted_data: AES.encrypt(JSON.stringify(pii), password),
        private_file_token: privateFileToken
      };
      const getEncryptedDataSpy = jest.spyOn(vault, 'getEncryptedData').mockResolvedValueOnce([encryptedPii]);
      const encryptedAttachment = AES.encryptBuffer(attachmentContents, password);
      const getAttachmentSpy = jest.spyOn(vault, 'getAttachment').mockResolvedValueOnce(encryptedAttachment);

      const result = await service.get(code);

      expect(result).toStrictEqual([{ ...pii, attachment: attachmentContents.toString('base64') }]);
      expect(getTokensSpy).toHaveBeenCalledTimes(2);
      expect(getTokensSpy).toHaveBeenNthCalledWith(1, { code, redirectUri });
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
