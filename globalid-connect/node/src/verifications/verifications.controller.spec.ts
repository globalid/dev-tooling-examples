import { createMock } from '@golevelup/ts-jest';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { code, mockConfigService } from '../../test/common';
import { NonceService } from './nonce.service';
import { VerificationsController } from './verifications.controller';
import { UserData } from './verifications.interface';
import { VerificationsService } from './verifications.service';

const connectUrl = 'https://connect.global.id/?scope=openid';
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
      providers: [{ provide: ConfigService, useValue: configServiceMock }, NonceService, VerificationsService]
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
    it('should return Connect URLs ', async () => {
      const nonce = 'foo';
      const generateSpy = jest.spyOn(nonceService, 'generate').mockReturnValueOnce(nonce);
      const result = controller.index();

      expect(result).toMatchObject({
        connectUrl: {
          href: `${connectUrl}&nonce=${nonce}`
        }
      });
      expect(generateSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('connect', () => {
    it('should delegate to the VerificationsService', async () => {
      const apiClientData = createMock<UserData>();
      const connectSpy = jest.spyOn(verificationsService, 'connect').mockResolvedValueOnce(apiClientData);

      const result = await controller.connect(code);

      expect(result).toBe(apiClientData);
      expect(connectSpy).toHaveBeenCalledTimes(1);
      expect(connectSpy).toHaveBeenCalledWith(code);
    });
  });
});
