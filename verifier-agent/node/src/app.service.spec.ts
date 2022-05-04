import { escape } from 'querystring';

import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';

import { clientId, exampleUrl, trackingId } from '../test/common';
import { AppService } from './app.service';

describe('AppService', () => {
  let appService: AppService;
  let configService: ConfigService;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      providers: [AppService, ConfigService]
    }).compile();

    appService = app.get(AppService);
    configService = app.get(ConfigService);
    jest.mock('@globalid/verifier-toolkit', () => {
      const original = jest.requireActual('@globalid/verifier-toolkit');
      return {
        ...original,
        createPresentationRequestUrl: jest.fn().mockResolvedValue([exampleUrl, trackingId])
      };
    });
  });

  afterEach(() => jest.clearAllMocks());

  it('should generate qr code', async () => {
    const getSpy = jest.spyOn(configService, 'get').mockReturnValueOnce(clientId).mockReturnValueOnce(exampleUrl);
    const qrCode = await appService.getPresentationRequestQrCode(trackingId);

    expect(qrCode).toContain(escape(trackingId));
    expect(qrCode).toContain(escape(clientId));
    expect(qrCode).toContain(escape(exampleUrl));

    expect(getSpy).toHaveBeenCalledWith('CLIENT_ID');
    expect(getSpy).toHaveBeenCalledWith('INITIATION_URL');
  });
});
