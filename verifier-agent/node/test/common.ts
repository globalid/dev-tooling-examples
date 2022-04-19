import { INestApplication } from '@nestjs/common';
import { WsAdapter } from '@nestjs/platform-ws';
import { Test } from '@nestjs/testing';
import { TrackingId } from 'src/types';

export const createNestApp = async (imports: any[]): Promise<INestApplication> => {
  const moduleFixture = await Test.createTestingModule({
    imports: [...imports]
  }).compile();

  const app = moduleFixture.createNestApplication();
  app.useWebSocketAdapter(new WsAdapter(app));
  return app;
};

export const webSocketUrl = 'ws://localhost:8080';

export const trackingId: TrackingId = 'd0078bfe-7e42-4574-867a-ea3deeb0dbe2';
