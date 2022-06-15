import * as request from 'supertest';

import { NestExpressApplication } from '@nestjs/platform-express';

import { createTestingApp } from './common';

describe('PresentationRequestController (e2e)', () => {
  let app: NestExpressApplication;

  beforeEach(async () => {
    app = await createTestingApp();
  });

  describe('/ (GET)', () => {
    it('should render HTML', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect('Content-Type', /^text\/html/);
    });
  });
});
