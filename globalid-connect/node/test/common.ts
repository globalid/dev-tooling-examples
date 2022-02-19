import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';

import { createMock } from '@golevelup/ts-jest';
import { HttpService } from '@nestjs/axios';

import { Tokens } from '../src/verifications/auth/tokens.interface';
import { Identity } from 'src/verifications/identity/identity.interface';


export const code = 'abcdefghijklmnopqrstuvwxyz';

export const accessToken = 'abcdefghijklmnopqrstuvwxyz';

export const tokens: Tokens = {
  access_token: accessToken,
  expires_in: 12345,
  scope: 'openid',
  token_type: 'foo'
};

export const attachmentContents = Buffer.from('lorem ipsum dolor sit amet');

export const partialIdentity: Partial<Identity> = {
  gid_uuid: '123456-abcdef-etc-etc',
  gid_name: "Test Name"
};

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
