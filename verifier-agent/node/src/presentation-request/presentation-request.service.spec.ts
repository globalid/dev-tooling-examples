import axiosMock from 'jest-mock-axios';

import { GidVerifierClient } from '@globalid/verifier-toolkit';
import { ProofRequestResponseDto } from '@globalid/verifier-toolkit/dist/presentation-request/create-proof-request-dto';
import { createMock } from '@golevelup/ts-jest';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';

import { mockConfigService, trackingId, userAcceptance } from '../../test/common';
import { gidVerifierClientProvider } from '../gid/gid-verifier-client.provider';
import { InvalidSignatureError } from '../invalid-signature-error';
import { presentationRequestServiceProvider } from './presentation-request-service.provider';
import { PresentationRequestService } from './presentation-request.service';

describe('PresentationRequestService', () => {
  let service: PresentationRequestService;
  let gidVerifierClient: GidVerifierClient;

  const mockProofRequestResponseDto: ProofRequestResponseDto = createMock<ProofRequestResponseDto>();

  beforeAll(() => {
    axiosMock.post.mockResolvedValue({ data: mockProofRequestResponseDto });
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ConfigService, gidVerifierClientProvider, presentationRequestServiceProvider]
    })
      .overrideProvider(ConfigService)
      .useValue(
        mockConfigService({
          BASE_URL: 'http://localhost:8080',
          GID_CREDENTIALS_BASE_URL: 'https://credentials.globalid.dev',
          GID_API_BASE_URL: 'https://api.globalid.dev',
          CLIENT_ID: 'abcdef',
          CLIENT_SECRET: '123456',
          INITIATION_URL: 'https://www.example.com',
          REDIRECT_URL: 'https://www.example1.com'
        })
      )
      .useMocker(createMock)
      .compile();

    service = module.get(PresentationRequestService);
    gidVerifierClient = module.get(GidVerifierClient);
  });

  afterEach(() => {
    axiosMock.reset();
  });

  describe('requestPresentation', () => {
    it('should create a presentation request and return the response from EPAM', async () => {
      const proofRequestResponseDto = await service.requestPresentation(trackingId);

      expect(proofRequestResponseDto).toBe(mockProofRequestResponseDto);
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
