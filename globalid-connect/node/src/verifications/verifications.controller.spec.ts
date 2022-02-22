import { createMock } from '@golevelup/ts-jest';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { VerificationsController } from './verifications.controller';

describe('VerificationsController', () => {
  let controller: VerificationsController;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ controllers: [VerificationsController] })
      .useMocker(createMock)
      .compile();

    controller = module.get<VerificationsController>(VerificationsController);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('index', () => {
    it('should return Connect URLs', async () => {
      const attestationsConnectUrl = 'https://connect.global.id/attestations';
      const identityConnectUrl = 'https://connect.global.id/identity';
      const piiConnectUrl = 'https://connect.global.id/pii';
      const configServiceSpy = jest.spyOn(configService, 'get')
        .mockImplementation(key => {
          switch (key) {
            case 'ATTESTATIONS_CONNECT_URL':
              return attestationsConnectUrl
            case 'IDENTITY_CONNECT_URL':
              return identityConnectUrl;
            case 'PII_CONNECT_URL':
              return piiConnectUrl;
            default:
              break;
          }
        })

      const result = controller.index();

      expect(result).toMatchObject({
        connectUrls: [
          {
            href: attestationsConnectUrl,
            label: expect.any(String)
          },
          {
            href: identityConnectUrl,
            label: expect.any(String)
          },
          {
            href: expect.stringContaining(piiConnectUrl),
            label: expect.any(String)
          }
        ]
      });
      expect(configServiceSpy).toHaveBeenCalledTimes(3);
    });
  });
});
