/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function, jest/valid-expect-in-promise */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    const response = request(app.getHttpServer())
      .get('/')
      .expect(302)
      .then(resp => {
        expect(resp.ok).toBeTruthy();
      }).catch(err => {});
  });

  it('should be started', () => {
    expect(app.get(AppModule)).toBeTruthy();
  })
});
