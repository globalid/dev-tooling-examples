import { INestApplication } from '@nestjs/common';
import { TrackingId } from '../src/types';
import { WebSocket } from 'ws';
import { PresentationRequestGateway } from '../src/presentationRequest/presentation-request.gateway';
import { createNestApp, webSocketUrl } from './common';

describe('PresentationRequestGateway', () => {
  let gateway: PresentationRequestGateway;
  let app: INestApplication;
  let ws: WebSocket;

  beforeEach(async () => {
    app = await createNestApp([PresentationRequestGateway]);
    await app.listen(3000);
    ws = new WebSocket(webSocketUrl);
  });

  afterEach(async () => await app.close());

  describe('register', () => {
    it('should register a client successfully', async () => {
      const trackingId: TrackingId = 'd0078bfe-7e42-4574-867a-ea3deeb0dbe2';
      await new Promise((resolve) => ws.on('open', resolve));

      ws.send(
        JSON.stringify({
          event: 'register-client',
          data: { trackingId }
        })
      );

      await new Promise<void>((resolve) =>
        ws.on('message', (event: any) => {
          const data = JSON.parse(event);
          expect(data.event).toBe('client-registered');
          expect(data.data).toBe('client successfully registered');
          resolve();
        })
      );
    });

    it('should return an error when trying to register a 2nd client with the same trackingId', async () => {
      const trackingId: TrackingId = 'b9a4f323-a8f7-4b85-8aab-d98b7f423e942';
      await new Promise((resolve) => ws.on('open', resolve));

      ws.send(
        JSON.stringify({
          event: 'register-client',
          data: { trackingId }
        })
      );
      await new Promise<void>((resolve) => ws.on('message', resolve));

      ws.send(
        JSON.stringify({
          event: 'register-client',
          data: { trackingId }
        })
      );
      await new Promise<void>((resolve) =>
        ws.on('message', (event: any) => {
          const data = JSON.parse(event);
          expect(data.event).toBe('client-register-error');
          expect(data.data).toContain('already exists');
          resolve();
        })
      );
    });

    it('should return an error if no trackingId provided', async () => {
      await new Promise((resolve) => ws.on('open', resolve));

      ws.send(
        JSON.stringify({
          event: 'register-client',
          data: { trackingId: null }
        })
      );

      await new Promise<void>((resolve) =>
        ws.on('message', (event: any) => {
          const data = JSON.parse(event);
          expect(data.event).toBe('client-register-error');
          expect(data.data).toBe('trackingId required');
          resolve();
        })
      );
    });
  });

  describe('unregister', () => {
    it('should unregister a client successfully', async () => {
      const trackingId: TrackingId = 'd0078bfe-7e42-4574-867a-ea3deeb0dbe2';
      await new Promise((resolve) => ws.on('open', resolve));

      ws.send(
        JSON.stringify({
          event: 'register-client',
          data: { trackingId }
        })
      );
      await new Promise((resolve) => ws.on('message', resolve));
      ws.send(
        JSON.stringify({
          event: 'unregister-client',
          data: { trackingId }
        })
      );
      await new Promise<void>((resolve) =>
        ws.on('message', (event: any) => {
          const data = JSON.parse(event);
          expect(data.event).toBe('client-unregistered');
          expect(data.data).toBe('client successfully unregistered');
          resolve();
        })
      );
    });

    it('should throw exception trying to send data after unregister', async () => {
      gateway = app.get(PresentationRequestGateway);
      const trackingId: TrackingId = 'd0078bfe-7e42-4574-867a-ea3deeb0dbe2';
      await new Promise((resolve) => ws.on('open', resolve));

      ws.send(
        JSON.stringify({
          event: 'register-client',
          data: { trackingId }
        })
      );
      await new Promise((resolve) => ws.on('message', resolve));
      ws.send(
        JSON.stringify({
          event: 'unregister-client',
          data: { trackingId }
        })
      );
      await new Promise((resolve) => ws.on('message', resolve));

      expect(() => gateway.rejectPresentation(trackingId, 'user rejected')).toThrow();
    });
  });

  describe('acceptPresentation', () => {
    it('should send acceptPresentation message successfully', async () => {
      gateway = app.get(PresentationRequestGateway);
      const trackingId: TrackingId = '89140555-cce2-4e37-80f9-01af4c24cdd6';
      await new Promise((resolve) => ws.on('open', resolve));

      ws.send(
        JSON.stringify({
          event: 'register-client',
          data: { trackingId }
        })
      );
      await new Promise<void>((resolve) => ws.on('message', resolve));

      const vPres = { user: '1234', accepted: true };
      gateway.acceptPresentation(trackingId, vPres);

      await new Promise<void>((resolve) =>
        ws.on('message', (event: any) => {
          const data = JSON.parse(event);
          expect(data.event).toBe('presentation-accepted');
          expect(JSON.parse(data.data)).toEqual(vPres);
          resolve();
        })
      );
    });

    it("should throw an exception when sending confirmation for trackingId that doesn't exist", async () => {
      gateway = app.get(PresentationRequestGateway);
      const trackingId: TrackingId = '89140555-cce2-4e37-80f9-01af4c24cdd6';
      await new Promise((resolve) => ws.on('open', resolve));

      ws.send(
        JSON.stringify({
          event: 'register-client',
          data: { trackingId }
        })
      );
      await new Promise<void>((resolve) => ws.on('message', resolve));

      const vPres = { user: '1234', accepted: true };
      expect(() => gateway.acceptPresentation('1234', vPres)).toThrow('no client socket found for trackingId 1234');
    });
  });

  describe('rejectPresentaion', () => {
    it('should send rejectPresentation message successfully', async () => {
      gateway = app.get(PresentationRequestGateway);
      const trackingId: TrackingId = '0fd0d264-9e5b-411c-aed1-6d128f676072';
      await new Promise((resolve) => ws.on('open', resolve));

      ws.send(
        JSON.stringify({
          event: 'register-client',
          data: { trackingId }
        })
      );
      await new Promise<void>((resolve) => ws.on('message', resolve));

      gateway.rejectPresentation(trackingId, 'user rejected');

      await new Promise<void>((resolve) =>
        ws.on('message', (event: any) => {
          const data = JSON.parse(event);
          expect(data.event).toBe('presentation-rejected');
          expect(JSON.parse(data.data)).toBe('user rejected');
          resolve();
        })
      );
    });

    it("should throw an exception when rejecting presentation for trackingId that doesn't exist", async () => {
      gateway = app.get(PresentationRequestGateway);
      const trackingId: TrackingId = '616ef657-fccb-4b47-bf8f-ebf0fe56089a';
      await new Promise((resolve) => ws.on('open', resolve));

      ws.send(
        JSON.stringify({
          event: 'register-client',
          data: { trackingId }
        })
      );
      await new Promise<void>((resolve) => ws.on('message', resolve));
      expect(() => gateway.rejectPresentation('1234', 'user rejected')).toThrow(
        'no client socket found for trackingId 1234'
      );
    });
  });
});
