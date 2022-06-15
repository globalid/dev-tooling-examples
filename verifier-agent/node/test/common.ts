import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '../src/app.module';
import { setup } from '../src/setup';

export const baseUrl = 'http://localhost:3000';
export const clientId = '13275c09-4c4c-4369-982b-28d5a679cb36';
export const clientSecret = '48688c67c6ee444348688c67c6ee4443';
export const signature = 'abcdefghijklmnopqrstuvwxyz';
export const trackingId = 'd0078bfe-7e42-4574-867a-ea3deeb0dbe2';

/**
 * Mock values returned by `ConfigService.get`
 *
 * @param env Key-Value pairs where Key is used to `get` a value from `ConfigService`
 */
export function mockConfigService(env: Record<string, any>) {
  return {
    get: jest.fn((key: string) => env[key])
  };
}

export async function createTestingApp(): Promise<NestExpressApplication> {
  const moduleFixture: TestingModule = await Test.createTestingModule({ imports: [AppModule] })
    .overrideProvider(ConfigService)
    .useValue(
      mockConfigService({
        BASE_URL: baseUrl,
        CLIENT_ID: clientId,
        CLIENT_SECRET: clientSecret
      })
    )
    .compile();

  const app = moduleFixture.createNestApplication<NestExpressApplication>();
  setup(app);
  await app.init();
  return app;
}
