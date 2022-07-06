import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from './app.controller';

describe('AppController', () => {
  let controller: AppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ controllers: [AppController] })
      .useMocker(createMock)
      .compile();

    controller = module.get<AppController>(AppController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('index', () => {
    it('should do nothing', () => {
      expect(controller.index()).toBeUndefined();
    });
  });
});
