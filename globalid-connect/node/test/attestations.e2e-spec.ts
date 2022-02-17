/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function, jest/valid-expect-in-promise */
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AttestationsService } from '../src/verifications/attestations/attestations.service'
import { INestApplication } from '@nestjs/common';
import { VerificationsModule } from '../src/verifications/verifications.module';
import { createMock } from '@golevelup/ts-jest';
import { Attestation } from '../src/verifications/attestations/attestation.interface';

describe('Attestations', () => {
  let app: INestApplication;
  let attestationsMock: Attestation[];
  let attestationsService: Partial<AttestationsService>;

  beforeAll(async () => {
    attestationsMock = createMock<Attestation[]>();
    attestationsService = {
      getAttestations: async (code: string) => attestationsMock,
    };
    const moduleRef = await Test.createTestingModule({
      imports: [VerificationsModule]
    })
      .overrideProvider(AttestationsService)
      .useValue(attestationsService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`GET /verifications/connect/attestations`, () => {
    request(app.getHttpServer())
      .get('/verifications/connect/attestations')
      .expect(200)
      .then(resp => {
        expect(resp.body).toMatchObject({
          data: attestationsMock,
        });
      }).catch(err => {});
  });

  afterAll(() => {
    app.close().catch(err => {});
  });
});
