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
    const attestations: Attestation[] = [
      {
        "uuid": "06689350-b90f-436b-ac1a-e7e0901efcde",
        "tracking_id": "d3b5c9c1-93bc-49ed-b2bf-748a3d0d2920",
        "type": "phone_number",
        "attestee": "mike",
        "attestee_uuid": "988374ee-d917-4adf-a9a7-9b9f3dcbd59a",
        "attestor": "twilio",
        "related_attestations": "03ad07db-70b0-4fdb-a747-bb9d3943b061,d3b5c9c1-93bc-49ed-b2bf-748a3d0d2920",
        "data_hash": "f13f5228d7c1456c5129c33467742308c04e6423a14e06108e76b3158e512b276a9539f4127ee4f81e9f632b25fcb185b8e9e21c1d16fd02ac2de4836f6cf79b",
        "attestor_signed_at": "2018-11-20T14:38:22.000Z",
        "attestee_signed_at": "2018-11-20T14:38:17.000Z",
        "attestor_signature": "Oe6zL1dn+v6dfxWfqv4c9Q+/lBSQvKc0OLHHnra0h6logFIEQeJJ8e0i2/ZirX8KmspYUtblTA7+nMoQDXkk6FzkV2cpCYw2MFAmfjZxEP84D8pBDPSbNmXVn/UrbnZJefE5mvHOakK+GTxoLMxkZamXVhdreAbGrEyX2IrJsypOaNvk+y8oP2m7zJi4yLAdbfN1NQpJxpgzAvQEvQvITl4qj3ZH+lNEcdzWKW/2537jan+Ml1Wh6hoC4A9otlkNPOaEvo8hNOwMDiqxvrpsbl+jMnu8dJqSnoB+aRcNGEFon8lpfyZ6rdlZDLl6BbGrMgSaZYwKEGYsGq5bJlFdQDs1EStKJMf857NFGOdP5VId/DGSiDnRnqNKQZorVaTcZe5IHQAFjCT7/M6nCxWcK91DrJd4HvcIvFqlNgj3TsdipU8yMMtqN8Voi6NGG4TET0Av0CRGgtU/I7KJ/F0mY6LKeDa2ppBx/4lRqCzHc6TnjfZOFUsmS+tRQ6r8yrpymeU2fP2yDZQAGhcZJHtS0GuO8qcxQcrzhBcrV8pkwbAHskh8R0dtWT/mghnOOvf309KL2xp4RzBYzmD6Xa2JEsJrmQF6x8r5moYVMVBgwGP7AeRn2nCYSxAU9Ldrs7NGr73+yiLhMM66epZd8riUsk6qRwIREW2FF0iC4Snzezc=",
        "attestee_signature": "hX5Evg81x39Snqw3gSHPstpk8np+i3yrwe6wzQLbs8aemrEAStMtrLOOR5yALBNKNlJtu3Ac1YCvutaOYvj+XC70lG4L09QspgR+JTGUkRinUuNH5XOO+75K7BO3o9SFutZql2NW07BYxNQhcHL0W/2tN0RaB7eaYUu6ASGdgLRv61LtwIbuEY5tF3TlvgNSsib6iUnz6u9fjiePhI/Y11OPcypK2xrWoRi7o6whEDPbPTZi5hCR6Krz59mHOqehkR5tcEUUKKGhvyQ2PgKM1tE1uIe75DSTWaATmGvOEAekJ02ibDAGMOoMnHyBamRgDyLt9M8awuG/B1cFusl7oQ==",
        "sig_version": 2,
        "public_data": "UK",
        "public_attestor_note": "Information about this attestation",
        "app_uuid": "06689350-b90f-436b-ac1a-e7e0901efcde"
      }
    ];
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
