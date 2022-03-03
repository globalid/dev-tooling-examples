import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';

import { createMock } from '@golevelup/ts-jest';
import { HttpService } from '@nestjs/axios';

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
