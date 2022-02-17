///* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function, jest/valid-expect-in-promise */
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AttestationsService } from '../src/verifications/attestations/attestations.service'
import { INestApplication } from '@nestjs/common';
import { VerificationsModule } from '../src/verifications/verifications.module';
import { createMock } from '@golevelup/ts-jest';
import { Attestation } from '../src/verifications/attestations/attestation.interface';
import { AppModule } from '../src/app.module';

describe('Attestations', () => {
  let app: INestApplication;
  let attestationsMock: Attestation[];

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    await app.listen(3300);
  });

  it(`GET /verifications/connect/attestations`, async () => {
    // Add `nock` here for Auth and Attestations endpoints
    attestationsMock = createMock<Attestation[]>();
    await request(app.getHttpServer())
      .get('/verifications/connect/attestations')
      .expect(200)
      .then(resp => {
        expect(resp.body).toMatchObject({
          data: attestationsMock,
        });
      });
  });

  afterAll(() => {
    app.close();
  });
});
