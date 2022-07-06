import { PresentationRequestResponseDto, UserAcceptance, UserRejection } from '@globalid/verifier-toolkit';
import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';

import { signature, trackingId } from '../../test/common';
import { PresentationRequestController } from './presentation-request.controller';
import { PresentationRequestService } from './presentation-request.service';
import { QrCodeViewModel } from './qr-code.view-model';

describe('PresentationRequestController', () => {
  let controller: PresentationRequestController;
  let service: PresentationRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ controllers: [PresentationRequestController] })
      .useMocker(createMock)
      .compile();

    controller = module.get(PresentationRequestController);
    service = module.get(PresentationRequestService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('index', () => {
    it('should return QrCodeViewModel', () => {
      const qrCodeViewModel = createMock<QrCodeViewModel>();
      const createQrCodeViewModelSpy = jest
        .spyOn(service, 'createQrCodeViewModel')
        .mockReturnValueOnce(qrCodeViewModel);

      const result = controller.index();

      expect(result).toBe(qrCodeViewModel);
      expect(createQrCodeViewModelSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('requestPresentation', () => {
    it('should create a presentation request', async () => {
      const response = createMock<PresentationRequestResponseDto>();
      const requestPresentationSpy = jest.spyOn(service, 'requestPresentation').mockResolvedValueOnce(response);

      const result = await controller.requestPresentation(trackingId);

      expect(result).toBe(response);
      expect(requestPresentationSpy).toHaveBeenCalledTimes(1);
      expect(requestPresentationSpy).toHaveBeenCalledWith(trackingId);
    });
  });

  describe('handleUserResponse', () => {
    let handleUserResponseSpy: jest.SpyInstance;

    beforeEach(() => {
      handleUserResponseSpy = jest.spyOn(service, 'handleUserResponse');
    });

    it('should handle user acceptance', async () => {
      const acceptance = createMock<UserAcceptance>();

      await controller.handleUserResponse(signature, acceptance);

      expect(handleUserResponseSpy).toHaveBeenCalledTimes(1);
      expect(handleUserResponseSpy).toHaveBeenCalledWith(signature, acceptance);
    });

    it('should handle user rejection', async () => {
      const rejection = createMock<UserRejection>();

      await controller.handleUserResponse(signature, rejection);

      expect(handleUserResponseSpy).toHaveBeenCalledTimes(1);
      expect(handleUserResponseSpy).toHaveBeenCalledWith(signature, rejection);
    });
  });
});
