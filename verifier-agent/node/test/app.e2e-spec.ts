import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { createNestApp } from './common';

import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  afterEach(async () => await app.close());

  it('/ (GET)', async () => {
    app = await createNestApp([AppModule]);
    await app.listen(3001);
    return request(app.getHttpServer()).get('/').expect(200).expect('Hello World!');
  });
});
