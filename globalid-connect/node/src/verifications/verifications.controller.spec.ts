import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';

import { code, decoupledId } from '../../test/common';
import { VerificationsController } from './verifications.controller';
import { UserData } from './user-data.interface';
import { VerificationsService } from './verifications.service';
import { ConsentCommand } from '@globalid/api-client';

describe('VerificationsController', () => {
  let controller: VerificationsController;
  let service: VerificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ controllers: [VerificationsController] })
      .useMocker(createMock)
      .compile();

    controller = module.get(VerificationsController);
    service = module.get(VerificationsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('index', () => {
    it('should return view model with Connect URL', async () => {
      const connectUrl = 'https://connect.global.id';
      const makeConnectUrlSpy = jest.spyOn(service, 'makeConnectUrl').mockReturnValueOnce(connectUrl);

      const result = controller.index();

      expect(result).toStrictEqual({ connectUrl });
      expect(makeConnectUrlSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('connect', () => {
    it('should delegate to the VerificationsService', async () => {
      const userData = createMock<UserData>();
      const connectSpy = jest.spyOn(service, 'connect').mockResolvedValueOnce(userData);

      const result = await controller.connect({ code });

      expect(result).toBe(userData);
      expect(connectSpy).toHaveBeenCalledTimes(1);
      expect(connectSpy).toHaveBeenCalledWith(code);
    });

    it('should support delayed verifications flow', async () => {
      const consentCommand = createMock<ConsentCommand>();
      const getDelayedVerificationsStatusSpy = jest
        .spyOn(service, 'getDelayedVerificationsStatus')
        .mockResolvedValueOnce(consentCommand);

      const result = await controller.connect({ code, decoupled_id: decoupledId });

      expect(result).toBe(consentCommand);
      expect(getDelayedVerificationsStatusSpy).toHaveBeenCalledTimes(1);
      expect(getDelayedVerificationsStatusSpy).toHaveBeenCalledWith(code, decoupledId);
    });
  });
});
