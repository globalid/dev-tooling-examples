import { createMock } from '@golevelup/ts-jest';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import * as crypto from 'crypto';
import { Observable } from 'rxjs';

import { Tokens } from '../src/verifications/auth/tokens.interface';

export const clientId = '12345678-90ab-cdef-edcb-a0987654321a';
export const clientSecret = 'abcdefghijklmnopqrstuvwxyz';

export const code = 'abcdefghijklmnopqrstuvwxyz';

export const connectUrl = 'https://connect.global.id';
export const piiRedirectUrl = 'http://localhost:300/verifications/pii';

export const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem'
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
    cipher: 'aes-256-cbc',
    passphrase: 'top secret'
  }
});

export const env = new Map([
  ['CLIENT_ID', clientId],
  ['CLIENT_SECRET', clientSecret],
  ['CONNECT_URL', connectUrl],
  ['REDIRECT_URL', piiRedirectUrl]
]);

export const accessToken = 'abcdefghijklmnopqrstuvwxyz';
export const idToken = '';

export const tokens: Tokens = {
  access_token: accessToken,
  expires_in: 12345,
  scope: 'openid',
  token_type: 'foo'
};

export function spyOnHttpPost(httpService: HttpService, data: any) {
  return jest.spyOn(httpService, 'post').mockReturnValueOnce(
    new Observable((subscriber) => {
      subscriber.next(createMock<AxiosResponse>({ data }));
      subscriber.complete();
    })
  );
}
