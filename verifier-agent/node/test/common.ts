import { INestApplication } from '@nestjs/common';
import { WsAdapter } from '@nestjs/platform-ws';
import { Test } from '@nestjs/testing';

export const createNestApp = async (imports: any[]): Promise<INestApplication> => {
  const moduleFixture = await Test.createTestingModule({
    imports: [...imports]
  }).compile();

  const app = moduleFixture.createNestApplication();
  app.useWebSocketAdapter(new WsAdapter(app));
  return app;
};
