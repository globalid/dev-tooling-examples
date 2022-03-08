import { join } from 'path';
import * as request from 'supertest';

import { NestExpressApplication } from '@nestjs/platform-express';
import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '../src/app.module';
import { GidApiMockBuilder } from '@globalid/api-client/dist/testing';
import { Attestation, Identity } from '@globalid/api-client';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { mockConfigService } from './common';

describe('VerificationsController (e2e)', () => {
  let app: NestExpressApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(ConfigService)
      .useValue(
        mockConfigService({
          CONNECT_URL: 'https://connect.global.id?foo=bar',
          REDIRECT_URI: 'http://localhost:3000/verifications/connect'
        })
      )
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.setBaseViewsDir(join(__dirname, '..', 'views'));
    app.setViewEngine('hbs');
    await app.init();
  });

  describe('GET /verifications', () => {
    it('should return HTML', () => {
      return request(app.getHttpServer())
        .get('/verifications')
        .expect(200)
        .expect('Content-Type', /^text\/html/);
    });
  });

  describe('GET /verifications/connect', () => {
    it('should return HTML', async () => {
      const attestations: Partial<Attestation>[] = [
        {
          attestor: 'foo',
          type: 'bar'
        }
      ];
      const identity: Partial<Identity> = {
        gid_name: 'foo',
        display_name: 'Foo'
      };
      const scope = new GidApiMockBuilder().mockGetAttestations(attestations).mockGetIdentity(identity).build();

      await request(app.getHttpServer())
        .get('/verifications/connect')
        .query('code=foo')
        .expect(200)
        .expect({ attestations, identity });
      expect(scope.isDone()).toBe(true);
    });

    it('should 400 without an authorization code', () => {
      return request(app.getHttpServer()).get('/verifications/connect').expect(400);
    });
  });
});
