import * as nock from 'nock';
import * as request from 'supertest';

import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '../src/app.module';
import { MissingIdTokenError } from '../src/verifications/pii/missing-id-token.error';
import {
  appTokens,
  code,
  configServiceMock,
  encryptedAttachment,
  encryptedPii,
  piiWithAttachment,
  privateFileToken,
  userTokens
} from './common';

describe('PiiController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    })
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('GET /verifications/connect/pii', () => {
    const route = '/verifications/connect/pii';

    it('should send decrypted PII', async () => {
      const scope = nock('https://api.global.id')
        .post('/v1/auth/token', (body) => body.code === code)
        .reply(200, userTokens)
        .post('/v1/auth/token')
        .reply(200, appTokens)
        .post('/v1/vault/get-encrypted-data')
        .reply(200, encryptedPii)
        .get(`/v1/vault/attachment/${privateFileToken}/client`)
        .reply(200, encryptedAttachment);

      const response = await request(app.getHttpServer()).get(route).query(`code=${code}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual([piiWithAttachment]);
      expect(scope.isDone()).toBeTruthy();
    });

    it('should 400 when ID token is missing', async () => {
      const scope = nock('https://api.global.id').post('/v1/auth/token').reply(200, appTokens);

      const response = await request(app.getHttpServer()).get(route).query(`code=${code}`);

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        message: new MissingIdTokenError().message,
        statusCode: 400
      });
      expect(scope.isDone()).toBeTruthy();
    });
  });
});
