import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService, ConfigService]
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('root', () => {
    it('should return render HomeView and QrCode', async () => {
      const mockQrCode = 'mock-qr-code';

      jest.spyOn(appService, 'getPresentationRequestQrCode').mockReturnValueOnce(Promise.resolve(mockQrCode));

      expect(await appController.renderHomeView()).toEqual({
        qrCodeURL: mockQrCode,
        trackingId: expect.any(String)
      });
    });
  });
});
