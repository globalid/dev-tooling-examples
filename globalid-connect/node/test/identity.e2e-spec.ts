import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import * as nock from 'nock';
import { accessToken, code } from './common';
import { Identity } from 'src/verifications/identity/identity.interface';

describe('Attestations', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('GET /identities/me', () => {
    it('should return identity', async () => {
      const partialIdentity: Partial<Identity> = {
        gid_uuid: '123456-abcdef-etc-etc',
        gid_name: "Test Name"
      };
      const scope = nock('https://api.global.id')
        .post('/v1/auth/token')
        .reply(200, { access_token: accessToken })
        .get('/v1/identities/me')
        .reply(200, partialIdentity);

      const response = await request(app.getHttpServer()).get(`/verifications/connect/identity?code=${code}`);

      expect(scope.isDone()).toBeTruthy();
      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject(partialIdentity);
    });
  });
});
