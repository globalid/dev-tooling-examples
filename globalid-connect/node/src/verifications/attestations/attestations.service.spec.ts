import { GidApiClient, GidApiClientFactory } from '@globalid/api-client';
import { createMock } from '@golevelup/ts-jest';
import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { accessToken, code, spyOnHttpGet } from '../../../test/common';
import { AuthService } from '../auth/auth.service';
import { Tokens } from '../auth/tokens.interface';
import { Attestation } from './attestation.interface';
import { AttestationsService } from './attestations.service';

describe('AttestationsService', () => {
  let service: AttestationsService;
  let authService: AuthService;
  let http: HttpService;
  let apiClient: GidApiClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ providers: [AttestationsService] })
      .useMocker(createMock)
      .compile();

    service = module.get(AttestationsService);
    authService = module.get(AuthService);
    http = module.get(HttpService);

    // Inject this
    apiClient = await new GidApiClientFactory({
      clientId: '123abc',
      clientSecret: 'sekret',
      redirectUri: 'http://localhost:3000/verifications/connect/attestations',
      privateKey: '-----BEGIN RSA PRIVATE KEY-----...-----END RSA PRIVATE KEY-----'
    }).create(code);

    apiClient.pii.get();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAttestations', () => {
    it('should get attestations from the API', async () => {
      const attestations = createMock<Attestation[]>();
      const getTokensSpy = jest
        .spyOn(authService, 'getTokens')
        .mockResolvedValueOnce(createMock<Tokens>({ access_token: accessToken }));
      const getSpy = spyOnHttpGet(http, attestations);

      const result = await service.getAttestations(code);
      expect(result).toBe(attestations);
      expect(getTokensSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          code
        })
      );
      expect(getSpy).toHaveBeenCalledTimes(1);
      expect(getSpy).toHaveBeenCalledWith('https://api.global.id/v1/attestations', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
    });
  });
});
