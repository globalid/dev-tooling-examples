import { createMock } from '@golevelup/ts-jest';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { mockConfigService } from '../../test/common';
import { VerificationsController } from './verifications.controller';

const connectUrl = 'https://connect.global.id/';
const configServiceMock = mockConfigService({
  CONNECT_URL: connectUrl
});

describe('VerificationsController', () => {
  let controller: VerificationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VerificationsController],
      providers: [{ provide: ConfigService, useValue: configServiceMock }]
    })
      .useMocker(createMock)
      .compile();

    controller = module.get(VerificationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('index', () => {
    it('should return Connect URLs', async () => {
      const result = controller.index();

      expect(result).toMatchObject({
        connectUrls: expect.arrayContaining([
          {
            href: connectUrl,
            label: 'Connect'
          }
        ])
      });
    });
  });
});
