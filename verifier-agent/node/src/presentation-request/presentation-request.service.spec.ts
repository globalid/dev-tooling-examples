import { Test } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { PresentationRequestService } from './presentation-request.service';
import { trackingId, userAcceptance } from '../../test/common';
import { ConfigService } from '@nestjs/config';
import { GidVerifierClient } from '../gid/gid-verifier-client';
import { InvalidSignatureError } from '../invalid-signature-error';
import { gidVerifierClientProvider } from '../gid/gid-verifier-client.provider';
import { presentationRequestServiceProvider } from './presentation-request-service.provider';

describe('PresentationRequestService', () => {
  let service: PresentationRequestService;
  let gidVerifierClient: GidVerifierClient;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ConfigService, gidVerifierClientProvider, presentationRequestServiceProvider]
    })
      .useMocker(createMock)
      .compile();

    service = module.get(PresentationRequestService);
    gidVerifierClient = module.get(GidVerifierClient);
  });

  describe('requestPresentation', () => {
    it('should create a presentation request and return the response from EPAM', async () => {
      const proofRequestResponseDto = await service.requestPresentation(trackingId);

      expect(proofRequestResponseDto).toBeDefined();
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
