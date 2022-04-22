import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
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
    jest.spyOn(presentationRequestService, 'createPresentationRequestUrl').mockImplementation(() => new URL(url));

    const qrCode = appService.getPresentationRequestQrCode(trackingId);

    expect(qrCode).toBe(url);
  });
});
