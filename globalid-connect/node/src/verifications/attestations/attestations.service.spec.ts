import { createMock } from '@golevelup/ts-jest';
import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { accessToken, code, spyOnHttpGet } from '../../../test/common';
import { Attestation } from './attestation.interface';
import { AttestationsService } from './attestations.service';

describe('AttestationsService', () => {
  let service: AttestationsService;
  let http: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ providers: [AttestationsService] })
      .useMocker(createMock)
      .compile();

    service = module.get(AttestationsService);
    http = module.get(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAttestations', () => {
    const attestations = createMock<Attestation[]>();
    let getSpy: jest.SpyInstance;

    beforeEach(() => {
      getSpy = spyOnHttpGet(http, attestations);
    });

    it('should get attestations from the API', async () => {
      const result = await service.getAttestations(code);

      expect(result).toBe(attestations);
      expect(getSpy).toHaveBeenCalledTimes(1);
      expect(getSpy).toHaveBeenCalledWith('https://api.global.id/v1/attestations', expect.any(Object));
    })
  });
});
