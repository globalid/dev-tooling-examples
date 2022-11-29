import { HolderAcceptance, HolderRejection, PresentationRequestResponseDto } from '@globalid/verifier-toolkit';
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
    it('should return QrCodeViewModel', async () => {
      const qrCodeViewModel = createMock<QrCodeViewModel>();
      const createQrCodeViewModelSpy = jest
        .spyOn(service, 'createQrCodeViewModel')
        .mockResolvedValueOnce(qrCodeViewModel);

      const result = await controller.index();

      expect(result).toBe(qrCodeViewModel);
      expect(createQrCodeViewModelSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('requestPresentation', () => {
    it('should create a presentation request', async () => {
      const response = createMock<PresentationRequestResponseDto>();
      const requestPresentationSpy = jest.spyOn(service, 'requestPresentation').mockResolvedValueOnce(response);

      const result = await controller.requestPresentation('name', trackingId);

      expect(result).toBe(response);
      expect(requestPresentationSpy).toHaveBeenCalledTimes(1);
      expect(requestPresentationSpy).toHaveBeenCalledWith('name', trackingId);
    });
  });

  describe('handleResponse', () => {
    let handleResponseSpy: jest.SpyInstance;

    beforeEach(() => {
      handleResponseSpy = jest.spyOn(service, 'handleResponse');
    });

    it('should handle holder acceptance', async () => {
      const acceptance = createMock<HolderAcceptance>();

      await controller.handleResponse(signature, acceptance);

      expect(handleResponseSpy).toHaveBeenCalledTimes(1);
      expect(handleResponseSpy).toHaveBeenCalledWith(signature, acceptance);
    });

    it('should handle holder rejection', async () => {
      const rejection = createMock<HolderRejection>();

      await controller.handleResponse(signature, rejection);

      expect(handleResponseSpy).toHaveBeenCalledTimes(1);
      expect(handleResponseSpy).toHaveBeenCalledWith(signature, rejection);
    });
  });
});
