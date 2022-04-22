import { createMock } from '@golevelup/ts-jest';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { trackingId } from '../test/common';
import { AppService } from './app.service';
import * as presentationRequestService from './gid/create-presentation-request-url';

describe('AppService', () => {
  let appService: AppService;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      providers: [AppService, ConfigService]
    }).compile();

    appService = app.get<AppService>(AppService);
  });

  afterEach(() => jest.resetAllMocks());

  it('should generate qr code', () => {
    const url = 'http://example.com/';
    const makeQrCodeSpy = jest
      .spyOn(presentationRequestService, 'createPresentationRequestUrl')
      .mockImplementation(() => new URL(url));

    const qrCode = appService.getPresentationRequestQrCode(trackingId);

    expect(makeQrCodeSpy).toHaveBeenCalledTimes(1);
    expect(makeQrCodeSpy).toHaveReturned();
    expect(qrCode).toContain('data:image/png;base64,');
    expect(qrCode).toBe(url);
  });
});
