///* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function, jest/valid-expect-in-promise */
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { createMock } from '@golevelup/ts-jest';
import { Attestation } from '../src/verifications/attestations/attestation.interface';
import { AppModule } from '../src/app.module';
import * as nock from 'nock';
import { accessToken, code, partialAttestations } from './common';

describe('Attestations', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [
        // HttpModule.register({
        //   adapter: require('axios/lib/adapters/http')
        // }),
        AppModule
      ]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    await app.listen(3000);
  });

  it(`GET /verifications/connect/attestations`, async () => {
    const attestationsMock = createMock<Attestation[]>(partialAttestations);
    nock('https://api.global.id')
      .get(`/v1/attestations`)
      .reply(200, attestationsMock);

    nock('https://api.global.id')
      .post('/v1/auth/token')
      .reply(200, { access_token: accessToken });

    await request(app.getHttpServer())
      .get(`/verifications/connect/attestations?code=${code}`)
      .then(resp => {
        expect(resp.statusCode).toBe(400);
      }, err => {
        console.error('Error in request', err)
      });
  });

  afterAll(() => {
    app.close();
  });
});
