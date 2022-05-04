import {
  GidVerifierClient,
  PresentationRequestResponseDto,
  PresentationRequirements
} from '@globalid/verifier-toolkit';
import { createMock } from '@golevelup/ts-jest';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';

import { mockConfigService, trackingId, userAcceptance } from '../../test/common';
import { InvalidSignatureError } from '../invalid-signature-error';
import { PresentationRequestService } from './presentation-request.service';
import { PresentationRequirementsFactory } from './presentation-requirements.factory';

describe('PresentationRequestService', () => {
  let service: PresentationRequestService;
  let gidVerifierClient: GidVerifierClient;
  let presentationRequirementsFactory: PresentationRequirementsFactory;

  const baseUrl = 'http://localhost:8080';

  beforeEach(async () => {
    const module = await Test.createTestingModule({ providers: [PresentationRequestService, ConfigService] })
      .useMocker(createMock)
      .overrideProvider(ConfigService)
      .useValue(
        mockConfigService({
          BASE_URL: baseUrl
        })
      )
      .compile();

    service = module.get(PresentationRequestService);
    gidVerifierClient = module.get(GidVerifierClient);
    presentationRequirementsFactory = module.get(PresentationRequirementsFactory);
  });

  describe('requestPresentation', () => {
    it('should create a presentation request and return the response', async () => {
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
      expect(createSpy).toHaveBeenCalledTimes(1);
      expect(createPresentationRequestSpy).toHaveBeenCalledTimes(1);
      expect(createPresentationRequestSpy).toHaveBeenCalledWith({
        trackingId,
        webhookUrl: `${baseUrl}/handle-user-response`,
        presentationRequirements
      });
    });
  });

  describe('verifySignature', () => {
    it('should call verifySignature one time', async () => {
      const verifySignatureSpy = jest.spyOn(gidVerifierClient, 'verifySignature').mockResolvedValueOnce(true);

      await service.verifySignature('asdf', userAcceptance);

      expect(verifySignatureSpy).toHaveBeenCalledTimes(1);
    });

    it('should fail with an invalid signature', async () => {
      const verifySignatureSpy = jest.spyOn(gidVerifierClient, 'verifySignature').mockResolvedValueOnce(false);

      await expect(async () => await service.verifySignature('asdf', userAcceptance)).rejects.toThrow(
        InvalidSignatureError
      );
      expect(verifySignatureSpy).toHaveBeenCalledTimes(1);
    });
  });
});
