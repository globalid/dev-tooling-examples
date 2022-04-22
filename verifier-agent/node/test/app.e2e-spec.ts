import * as request from 'supertest';

import { INestApplication } from '@nestjs/common';

import { AppModule } from '../src/app.module';
import { createNestApp } from './common';
import { ConfigService } from '@nestjs/config';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(() => {
    process.env = {
      NODE_ENV: 'development',
      GID_CREDENTIALS_BASE_URL: 'https://credentials.global.id',
      GID_API_BASE_URL: 'https://api.global.id',

      CLIENT_ID: 'uuid',
      CLIENT_SECRET: 'abc123',

      INITIATION_URL: 'https://www.example.com',
      REDIRECT_URL: 'https://www.example1.com'
    };
  });

  afterEach(async () => await app.close());

  it('/ (GET)', async () => {
    app = await createNestApp([AppModule, ConfigService]);
    await app.listen(3001);
    return request(app.getHttpServer()).get('/').expect(200);
  });
});
