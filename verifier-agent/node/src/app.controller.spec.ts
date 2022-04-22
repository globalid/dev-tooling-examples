import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService]
    })
      .useMocker(createMock)
      .compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root getQrCode', () => {
    it('should return a base64 img', async () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
