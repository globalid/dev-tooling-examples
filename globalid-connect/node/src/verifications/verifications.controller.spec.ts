import { createMock } from '@golevelup/ts-jest';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { mockConfigService } from '../../test/common';
import { NonceService } from './nonce.service';
import { VerificationsController } from './verifications.controller';

const attestationsConnectUrl = 'https://connect.global.id/attestations';
const identityConnectUrl = 'https://connect.global.id/identity';
const piiConnectUrl = 'https://connect.global.id/pii';

const configServiceMock = mockConfigService({
  ATTESTATIONS_CONNECT_URL: attestationsConnectUrl,
  IDENTITY_CONNECT_URL: identityConnectUrl,
  PII_CONNECT_URL: piiConnectUrl
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

    controller = module.get(VerificationsController);
    nonceService = module.get(NonceService);
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
            href: attestationsConnectUrl,
            label: 'Connect and get attestations'
          },
          {
            href: identityConnectUrl,
            label: 'Connect and get identity'
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
