import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';

import { code } from '../../test/common';
import { VerificationsController } from './verifications.controller';
import { UserData } from './user-data.interface';
import { VerificationsService } from './verifications.service';

describe('VerificationsController', () => {
  let controller: VerificationsController;
  let verificationsService: VerificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VerificationsController],
      providers: [VerificationsService]
    })
      .useMocker(createMock)
      .compile();

    controller = module.get(VerificationsController);
    verificationsService = module.get(VerificationsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('index', () => {
    it('should return Connect URLs', async () => {
      const connectUrl = 'https://connect.global.id/?scope=openid';
      const makeConnectUrlSpy = jest.spyOn(verificationsService, 'makeConnectUrl').mockReturnValueOnce(connectUrl);
      const result = controller.index();

      expect(result).toMatchObject({
        connectUrl
      });
      expect(makeConnectUrlSpy).toHaveBeenCalledTimes(1);
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
