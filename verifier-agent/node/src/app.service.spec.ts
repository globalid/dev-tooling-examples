import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';

import { AppService } from './app.service';

describe('AppService', () => {
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({ providers: [AppService] })
      .useMocker(createMock)
      .compile();

    appService = app.get<AppService>(AppService);
  });

  describe('service getQrCode', () => {
    it('should return a Promise<string>', async () => {
      const makeQrCodeSpy = jest.spyOn(appService, 'getQrCode');

      const qrCode = await appService.getQrCode();

      expect(makeQrCodeSpy).toHaveBeenCalledTimes(1);
      expect(makeQrCodeSpy).toHaveReturned();
      expect(qrCode).toContain('data:image/png;base64,');
    });
  });
});
