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
    it('should return "Hello World!"', () => {
      const mockQrCode: Promise<string> = new Promise(() => 'mock-qr-code');
      jest.spyOn(appService, 'getPresentationRequestQrCode').mockImplementation(() => mockQrCode);

      expect(appController.renderHomeView()).toEqual({
        qrCode: mockQrCode,
        trackingId: expect.any(String)
      });
    });
  });
});
