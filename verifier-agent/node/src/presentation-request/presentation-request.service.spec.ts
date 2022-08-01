import {
  GidVerifierClient,
  HolderAcceptance,
  HolderRejection,
  PresentationRequestResponseDto,
  PresentationRequirements
} from '@globalid/verifier-toolkit';
import { createMock } from '@golevelup/ts-jest';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';

import { baseUrl, mockConfigService, signature, trackingId } from '../../test/common';
import { ClientService } from './client/client.service';
import { InvalidSignatureError } from './invalid-signature.error';
import { PresentationRequestService } from './presentation-request.service';
import { PresentationRequirementsFactory } from './presentation-requirements.factory';

describe('PresentationRequestService', () => {
  let service: PresentationRequestService;
  let clientService: ClientService;
  let gidVerifierClient: GidVerifierClient;
  let presentationRequirementsFactory: PresentationRequirementsFactory;

  beforeEach(async () => {
    const module = await Test.createTestingModule({ providers: [ConfigService, PresentationRequestService] })
      .useMocker(createMock)
      .overrideProvider(ConfigService)
      .useValue(
        mockConfigService({
          BASE_URL: baseUrl
        })
      )
      .compile();

    service = module.get(PresentationRequestService);
    clientService = module.get(ClientService);
    gidVerifierClient = module.get(GidVerifierClient);
    presentationRequirementsFactory = module.get(PresentationRequirementsFactory);
  });

  describe('createQrCodeViewModel', () => {
    it('should create and return view model', () => {
      const result = service.createQrCodeViewModel();

      expect(result).toMatchObject({
        wsUrl: baseUrl,
        trackingId: expect.any(String),
        qrCodeUrl: expect.any(URL)
      });
    });
  });

  describe('requestPresentation', () => {
    it('should create and return presentation request', async () => {
      const awaitResponseSpy = jest.spyOn(clientService, 'sendAwaitingResponse');
      const presentationRequirements = createMock<PresentationRequirements>();
      const createSpy = jest
        .spyOn(presentationRequirementsFactory, 'create')
        .mockReturnValueOnce(presentationRequirements);
      const presentationRequestResponseDto = createMock<PresentationRequestResponseDto>();
      const createPresentationRequestSpy = jest
        .spyOn(gidVerifierClient, 'createPresentationRequest')
        .mockResolvedValueOnce(presentationRequestResponseDto);

      const result = await service.requestPresentation(trackingId);

      expect(result).toBe(presentationRequestResponseDto);
      expect(awaitResponseSpy).toHaveBeenCalledTimes(1);
      expect(awaitResponseSpy).toHaveBeenCalledWith(trackingId);
      expect(createSpy).toHaveBeenCalledTimes(1);
      expect(createPresentationRequestSpy).toHaveBeenCalledTimes(1);
      expect(createPresentationRequestSpy).toHaveBeenCalledWith({
        presentationRequirements,
        trackingId,
        webhookUrl: `${baseUrl}/handle-response`
      });
    });
  });

  describe('handleResponse', () => {
    let sendAcceptanceSpy: jest.SpyInstance;
    let sendRejectionSpy: jest.SpyInstance;
    let verifySignatureSpy: jest.SpyInstance;

    beforeEach(() => {
      sendAcceptanceSpy = jest.spyOn(clientService, 'sendAcceptance');
      sendRejectionSpy = jest.spyOn(clientService, 'sendRejection');
      verifySignatureSpy = jest.spyOn(gidVerifierClient, 'verifySignature');
    });

    it('should handle holder acceptance', async () => {
      const acceptance = new HolderAcceptance();
      verifySignatureSpy.mockResolvedValueOnce(true);

      await service.handleResponse(signature, acceptance);

      expect(verifySignatureSpy).toHaveBeenCalledTimes(1);
      expect(verifySignatureSpy).toHaveBeenCalledWith(signature, acceptance);
      expect(sendAcceptanceSpy).toHaveBeenCalledTimes(1);
      expect(sendAcceptanceSpy).toHaveBeenCalledWith(acceptance);
      expect(sendRejectionSpy).not.toHaveBeenCalled();
    });

    it('should handle holder rejection', async () => {
      const rejection = new HolderRejection();
      verifySignatureSpy.mockResolvedValueOnce(true);

      await service.handleResponse(signature, rejection);

      expect(verifySignatureSpy).toHaveBeenCalledTimes(1);
      expect(verifySignatureSpy).toHaveBeenCalledWith(signature, rejection);
      expect(sendAcceptanceSpy).not.toHaveBeenCalled();
      expect(sendRejectionSpy).toHaveBeenCalledTimes(1);
      expect(sendRejectionSpy).toHaveBeenCalledWith(rejection);
    });

    it('should throw error when signature is invalid', async () => {
      const acceptance = new HolderAcceptance();
      verifySignatureSpy.mockResolvedValueOnce(false);

      await expect(() => service.handleResponse(signature, acceptance)).rejects.toThrow(InvalidSignatureError);
      expect(verifySignatureSpy).toHaveBeenCalledTimes(1);
      expect(verifySignatureSpy).toHaveBeenCalledWith(signature, acceptance);
      expect(sendAcceptanceSpy).not.toHaveBeenCalled();
      expect(sendRejectionSpy).not.toHaveBeenCalled();
    });
  });
});
