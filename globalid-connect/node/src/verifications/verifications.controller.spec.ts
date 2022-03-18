import { Response } from 'express';

import { ConsentCommand } from '@globalid/api-client';
import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';

import { code, decoupledId } from '../../test/common';
import { UserData } from './user-data.interface';
import { VerificationsController } from './verifications.controller';
import { VerificationsService } from './verifications.service';
import { ErrorParams } from './error-params';

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
    let res;

    beforeEach(() => {
      res = createMock<Response>();
    });

    it('should delegate to the VerificationsService', async () => {
      const userData = createMock<UserData>();
      const connectSpy = jest.spyOn(service, 'connect').mockResolvedValueOnce(userData);

      await controller.connect({ code }, res);

      expect(connectSpy).toHaveBeenCalledTimes(1);
      expect(connectSpy).toHaveBeenCalledWith(code);
      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith('connect', userData);
    });

    it('should handle user decline flow', async () => {
      const errorParams = new ErrorParams();

      await controller.connect(errorParams, res);

      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith('error', errorParams);
    });

    it('should handle delayed verifications flow', async () => {
      const consentCommand = createMock<ConsentCommand>();
      const getDelayedVerificationsStatusSpy = jest
        .spyOn(service, 'getDelayedVerificationsStatus')
        .mockResolvedValueOnce(consentCommand);

      await controller.connect({ code, decoupledId }, res);

      expect(getDelayedVerificationsStatusSpy).toHaveBeenCalledTimes(1);
      expect(getDelayedVerificationsStatusSpy).toHaveBeenCalledWith(code, decoupledId);
      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith('delayed', consentCommand);
    });
  });
});
