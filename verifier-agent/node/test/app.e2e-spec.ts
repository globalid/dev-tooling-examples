import * as request from 'supertest';

import { INestApplication } from '@nestjs/common';

import { AppModule } from '../src/app.module';
import { createNestApp } from './common';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(() => {
    jest.setTimeout(15000);
  });

  afterEach(async () => {
    if (app != null) {
      await app.close();
    }
  });

  afterEach(async () => await app.close());

  it('/ (GET)', async () => {
    app = await createNestApp([AppModule]);
    await app.listen(3001);
    return request(app.getHttpServer()).get('/').expect(200);
  });
});
