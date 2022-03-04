import { createMock } from '@golevelup/ts-jest';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { code, mockConfigService } from '../../test/common';
import { NonceService } from './nonce.service';
import { VerificationsController } from './verifications.controller';
import { VerificationsService } from './verifications.service';

const connectUrl = 'https://connect.global.id/';
const configServiceMock = mockConfigService({
  CONNECT_URL: connectUrl
});

describe('VerificationsController', () => {
  let controller: VerificationsController;
  let nonceService: NonceService;
  let verificationsService: VerificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VerificationsController],
      providers: [{ provide: ConfigService, useValue: configServiceMock }]
    })
      .useMocker(createMock)
      .compile();

    controller = module.get(VerificationsController);
    nonceService = module.get(NonceService);
    verificationsService = module.get(VerificationsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('index', () => {
    it('should return Connect URLs', async () => {
      const nonce = 'foo';
      const generateSpy = jest.spyOn(nonceService, 'generate').mockReturnValueOnce(nonce);
      const result = controller.index();

      expect(result).toMatchObject({
        connectUrls: expect.arrayContaining([
          {
            href: connectUrl,
            label: 'Connect'
          },
          {
            href: expect.stringContaining(`nonce=${nonce}`),
            label: 'Connect and get PII'
          }
        ])
      });
      expect(generateSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('connect', () => {
    it('should connect the VerificationsService', async () => {
      const connectSpy = jest.spyOn(verificationsService, 'connect');

      controller.connect(code);

      expect(connectSpy).toHaveBeenCalledTimes(1);
    });
  });
});
