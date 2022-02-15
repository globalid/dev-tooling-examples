import { createMock } from '@golevelup/ts-jest';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';

export const code = 'abcdefghijklmnopqrstuvwxyz';

export const accessToken = 'abcdefghijklmnopqrstuvwxyz';

export function spyOnHttpPost(httpService: HttpService, data: any) {
  return jest.spyOn(httpService, 'post').mockReturnValueOnce(
    new Observable((subscriber) => {
      subscriber.next(createMock<AxiosResponse>({ data }));
      subscriber.complete();
    })
  );
}
