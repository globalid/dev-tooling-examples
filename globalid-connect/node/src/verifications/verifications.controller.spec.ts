import { createMock } from '@golevelup/ts-jest';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { mockConfigService } from '../../test/common';
import { NonceService } from './nonce.service';
import { VerificationsController } from './verifications.controller';

const connectUrl = 'https://connect.global.id/';
const configServiceMock = mockConfigService({
  CONNECT_URL: connectUrl
});

describe('VerificationsController', () => {
  let controller: VerificationsController;
  let nonceService: NonceService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VerificationsController],
      providers: [{ provide: ConfigService, useValue: configServiceMock }]
    })
      .useMocker(createMock)
      .compile();

    nonceService = module.get(NonceService);
    controller = module.get(VerificationsController);
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
});
