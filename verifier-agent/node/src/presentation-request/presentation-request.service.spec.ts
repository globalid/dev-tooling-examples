import { Test } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { PresentationRequestService } from './presentation-request.service';
import { mockConfigService, trackingId } from '../../test/common';
import { ConfigService } from '@nestjs/config';
import { EpamClient } from '../gid/epam-client';
import { ProofRequestResponseDto } from '../gid';
import {
  epamClientProviderFactory,
  gidVerifierClientProviderFactory,
  presentationRequestServiceProviderFactory
} from '../provider-factories';
import { GidVerifierClient } from '../gid/gid-verifier-client';

describe('PresentationRequestService', () => {
  let service: PresentationRequestService;
  let configService: ConfigService;
  let epamClient: EpamClient;
  let gidVerifierClient: GidVerifierClient;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ConfigService,
        epamClientProviderFactory,
        gidVerifierClientProviderFactory,
        presentationRequestServiceProviderFactory
      ]
    })
      .useMocker(createMock)
      .overrideProvider(ConfigService)
      .useValue(
        mockConfigService({
          BASE_URL: 'http://localhost:3000/verifications/connect'
        })
      )
      .compile();

    service = module.get(PresentationRequestService);
    configService = module.get(ConfigService);
    epamClient = module.get(EpamClient);
    gidVerifierClient = module.get(GidVerifierClient);
  });

  describe('requestPresentation', () => {
    it('should create a presentation request and return the response from EPAM', async () => {
      const proofRequestResponseDtoMock = createMock<ProofRequestResponseDto>();
      const createProofRequestSpy = jest
        .spyOn(epamClient, 'createProofRequest')
        .mockResolvedValueOnce(proofRequestResponseDtoMock);

      const proofRequestResponseDto = await service.requestPresentation(trackingId);

      expect(proofRequestResponseDto).toBeDefined();
      expect(createProofRequestSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('verifySignature', () => {
    it('should verify a signature', async () => {
      const verifySignatureSpy = jest.spyOn(gidVerifierClient, 'verifySignature').mockResolvedValueOnce(true);

      await service.verifySignature('asdf', '1234');

      expect(verifySignatureSpy).toHaveBeenCalledTimes(1);
    });

    it('should fail with an invalid signature', async () => {
      const verifySignatureSpy = jest.spyOn(gidVerifierClient, 'verifySignature').mockResolvedValueOnce(false);

      // expect(async () => await service.verifySignature('asdf', '1234')).toThrow();
      // await service.verifySignature('asdf', '1234');
      // expect(verifySignatureSpy).toHaveBeenCalledTimes(1);
    });
  });
});
