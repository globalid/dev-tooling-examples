import * as crypto from 'crypto';
import { AES, RSA } from 'globalid-crypto-library';
import * as jwt from 'jsonwebtoken';

import { createMock } from '@golevelup/ts-jest';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth/auth.service';
import { VaultService } from '../vault/vault.service';

import { code } from '../../../test/common';
import { AuthService } from '../auth/auth.service';
import { Tokens } from '../auth/tokens.interface';
import { EncryptedPii } from '../vault/encrypted-pii.interface';
import { VaultService } from '../vault/vault.service';
import { PiiService } from './pii.service';
import { Pii } from './pii.interface';

const redirectUri = 'http://localhost:300/verifications/pii';

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
              if (key === 'REDIRECT_URI') return redirectUri;
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
        .mockResolvedValueOnce(createMock<Tokens>({ id_token: idToken }));
      const password = crypto.randomBytes(32).toString('hex');
      const pii: Pii = {
        attestation_request_uuid: 'request-uuid',
        gid_uuid: 'gid-uuid',
        type: 'name',
        value: 'foo'
      };
      const encryptedPii: EncryptedPii = {
        encrypted_data_password: RSA.encrypt(publicKey, password),
        encrypted_data: AES.encrypt(JSON.stringify(pii), password)
      };
      const getEncryptedDataSpy = jest.spyOn(vault, 'getEncryptedData').mockResolvedValueOnce([encryptedPii]);

      const result = await service.get(code);

      expect(result).toStrictEqual([pii]);
      expect(getTokensSpy).toHaveBeenCalledTimes(1);
      expect(getTokensSpy).toHaveBeenCalledWith({ code, redirectUri });
      expect(getEncryptedDataSpy).toHaveBeenCalledTimes(1);
      expect(getEncryptedDataSpy).toHaveBeenCalledWith(consentTokens);
    });
  });
});
