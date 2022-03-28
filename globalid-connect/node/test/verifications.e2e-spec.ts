import * as request from 'supertest';

import { Attestation, Identity } from '@globalid/api-client';
import { GidApiMockBuilder } from '@globalid/api-client/testing';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '../src/app.module';
import { setup } from '../src/setup';
import { code, decoupledId, mockConfigService } from './common';

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
    setup(app);
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
        .query(`code=${code}`)
        .expect(200)
        .expect('Content-Type', /^text\/html/);
      expect(scope.isDone()).toBe(true);
    });

    it('should handle user decline flow', () => {
      return request(app.getHttpServer())
        .get('/verifications/connect')
        .query('error=foo&error_description=Lorem+ipsum')
        .expect(200)
        .expect('Content-Type', /^text\/html/);
    });

    it('should handle delayed verifications flow', async () => {
      const scope = new GidApiMockBuilder().mockGetConsentCommand(decoupledId).build();

      await request(app.getHttpServer())
        .get('/verifications/connect')
        .query(`code=${code}&decoupled_id=${decoupledId}`)
        .expect(200)
        .expect('Content-Type', /^text\/html/);
      expect(scope.isDone()).toBe(true);
    });

    it('should 400 without query params', () => {
      return request(app.getHttpServer()).get('/verifications/connect').expect(400);
    });
  });
});
