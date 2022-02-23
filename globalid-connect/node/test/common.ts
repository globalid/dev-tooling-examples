import { AxiosResponse } from 'axios';
import * as crypto from 'crypto';
import { AES, RSA } from 'globalid-crypto-library';
import * as jwt from 'jsonwebtoken';
import { Observable } from 'rxjs';

import { createMock } from '@golevelup/ts-jest';
import { HttpService } from '@nestjs/axios';

import { Tokens } from '../src/verifications/auth/tokens.interface';
import { Pii } from '../src/verifications/pii/pii.interface';
import { EncryptedPii } from '../src/verifications/vault/encrypted-pii.interface';

export const code = 'abcdefghijklmnopqrstuvwxyz';

export const accessToken = 'abcdefghijklmnopqrstuvwxyz';

export const appTokens: Tokens = {
  access_token: accessToken,
  expires_in: 12345,
  scope: 'openid',
  token_type: 'foo'
};

export const { public_key: publicKey, private_key: privateKey, passphrase } = RSA.generateKeyPair(4096);
export const consentTokens = ['foo', 'bar', 'baz'];
export const idToken = jwt.sign(
  {
    'idp.globalid.net/claims/acrc_id': {
      consentId1: [RSA.encrypt(publicKey, consentTokens[0])],
      consentId2: [RSA.encrypt(publicKey, consentTokens[1])],
      consentId3: [RSA.encrypt(publicKey, consentTokens[2])]
    }
  },
  privateKey
);

export const userTokens: Tokens = {
  ...appTokens,
  id_token: idToken
};

export const privateFileToken = 'foo';

export const pii: Pii = {
  attestation_request_uuid: 'request-uuid',
  gid_uuid: 'gid-uuid',
  type: 'name',
  value: 'foo',
  has_attachment: true
};

const password = crypto.randomBytes(32).toString('hex');

export const encryptedPii: EncryptedPii[] = [
  {
    encrypted_data_password: RSA.encrypt(publicKey, password),
    encrypted_data: AES.encrypt(JSON.stringify(pii), password),
    private_file_token: privateFileToken
  }
];

export const attachmentContents = Buffer.from('lorem ipsum dolor sit amet');
export const encryptedAttachment = AES.encryptBuffer(attachmentContents, password);

export const piiWithAttachment: Pii = {
  ...pii,
  attachment: attachmentContents.toString('base64')
};

export const configServiceMock = mockConfigService({
  PRIVATE_KEY: privateKey,
  PRIVATE_KEY_PASSPHRASE: passphrase
});

export function mockConfigService(env: Record<string, any>) {
  return {
    get: jest.fn((key: string) => env[key])
  };
}

export function spyOnHttpPost(httpService: HttpService, data?: any) {
  return spyOnHttp(httpService, 'post', data);
}

export function spyOnHttpGet(httpService: HttpService, data?: any) {
  return spyOnHttp(httpService, 'get', data);
}

function spyOnHttp(httpService: HttpService, method: keyof HttpService, data?: any) {
  return jest.spyOn(httpService, method).mockReturnValueOnce(
    new Observable((subscriber) => {
      subscriber.next(createMock<AxiosResponse>({ data }));
      subscriber.complete();
    })
  );
}
