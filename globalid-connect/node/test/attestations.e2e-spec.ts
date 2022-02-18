///* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function, jest/valid-expect-in-promise */
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import * as nock from 'nock';
import { accessToken, code, partialAttestations } from './common';

describe('Attestations', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it(`GET /verifications/connect/attestations`, async () => {
    const scope = nock('https://api.global.id')
      .get(`/v1/attestations`)
      .reply(200, partialAttestations)
      .post('/v1/auth/token')
      .reply(200, { access_token: accessToken });

    const response = await request(app.getHttpServer())
      .get(`/verifications/connect/attestations?code=${code}`);

    expect(scope.isDone()).toBeTruthy();
    expect(response.statusCode).toBe(200)
    expect(response.body).toMatchObject(partialAttestations)
  });
});
