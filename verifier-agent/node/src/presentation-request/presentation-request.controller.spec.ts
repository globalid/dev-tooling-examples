import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';

import {
  createProofRequestAxiosResponse,
  trackingId,
  userAcceptance,
  userRejection,
  xSignature
} from '../../test/common';
import { PresentationRequestController } from './presentation-request.controller';
import { PresentationRequestService } from './presentation-request.service';
import { PresentationRequestGateway } from './presentation-request.gateway';
import { InvalidSignatureError } from '../invalid-signature-error';

describe('PresentationRequestController', () => {
  let controller: PresentationRequestController;
  let service: PresentationRequestService;
  let gateway: PresentationRequestGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ controllers: [PresentationRequestController] })
      .useMocker(createMock)
      .compile();

    controller = module.get(PresentationRequestController);
    service = module.get(PresentationRequestService);
    gateway = module.get(PresentationRequestGateway);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('requestPresentation', () => {
    it('should create a presentation request and return the response from EPAM', async () => {
      const requestPresentationSpy = jest
        .spyOn(service, 'requestPresentation')
        .mockResolvedValueOnce(createProofRequestAxiosResponse.data);

      const result = await controller.requestPresentation(trackingId);

      expect(result).toBe(createProofRequestAxiosResponse.data);
      expect(requestPresentationSpy).toHaveBeenCalledTimes(1);
      expect(requestPresentationSpy).toHaveBeenCalledWith(trackingId);
    });
  });

  describe('handleUserResponse', () => {
    let req: any;

    beforeEach(() => {
      req = createMock<Express.Request>({ headers: xSignature });
    });

    it('should accept the presentation request when the signature is verified and a UserAcceptance is received', async () => {
      const verifySignatureSpy = jest.spyOn(service, 'verifySignature').mockResolvedValueOnce(true);
      const acceptPresentationSpy = jest.spyOn(gateway, 'acceptPresentation');

      await controller.handleUserResponse(userAcceptance, req);

      expect(verifySignatureSpy).toHaveBeenCalledTimes(1);
      expect(acceptPresentationSpy).toHaveBeenCalledTimes(1);
      expect(acceptPresentationSpy).toHaveBeenCalledWith(userAcceptance.tracking_id, userAcceptance.proof_presentation);
    });

    it('should reject the presentation request when the signature is verified and a UserRejection is received', async () => {
      const verifySignatureSpy = jest.spyOn(service, 'verifySignature').mockResolvedValueOnce(true);
      const rejectPresentationSpy = jest.spyOn(gateway, 'rejectPresentation');

      await controller.handleUserResponse(userRejection, req);

      expect(verifySignatureSpy).toHaveBeenCalledTimes(1);
      expect(rejectPresentationSpy).toHaveBeenCalledTimes(1);
      expect(rejectPresentationSpy).toHaveBeenCalledWith(userRejection.tracking_id, userRejection.error_msg);
    });

    it('should reject the presentation request when the signature is not verified', async () => {
      const verifySignatureSpy = jest
        .spyOn(service, 'verifySignature')
        .mockRejectedValueOnce(new InvalidSignatureError());

      await expect(async () => controller.handleUserResponse(userRejection, req)).rejects.toThrow(
        InvalidSignatureError
      );

      expect(verifySignatureSpy).toHaveBeenCalledTimes(1);
    });
  });
});
