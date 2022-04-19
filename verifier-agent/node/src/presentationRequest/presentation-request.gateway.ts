import { WebSocket } from 'ws';

import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WsResponse } from '@nestjs/websockets';

import { Maybe, TrackingId } from '../types';
import { RegisterClientEvent, SocketEvent, VerifiablePresentation } from './presentation-request.types';

// TODO remove when config is figured out
const websocketPort = 8080;

@WebSocketGateway(websocketPort)
export class PresentationRequestGateway {
  private websocketRegistry: Map<TrackingId, WebSocket>;

  constructor() {
    // TODO log host also once config is figured out
    console.log(`websocket server listening on :${websocketPort}`);
    this.websocketRegistry = new Map<TrackingId, WebSocket>();
  }

  @SubscribeMessage('register-client')
  register(@ConnectedSocket() client: WebSocket, @MessageBody() data: RegisterClientEvent): WsResponse<string> {
    if (!data.trackingId) {
      return { event: SocketEvent.ClientRegisterError, data: 'trackingId required' };
    }

    const registered = this.addSocketToRegistry(data.trackingId, client);
    if (!registered) {
      return { event: SocketEvent.ClientRegisterError, data: `trackingId "${data.trackingId}" already exists` };
    }

    return { event: SocketEvent.ClientRegistered, data: 'client successfully registered' };
  }

  acceptPresentation(trackingId: TrackingId, payload: VerifiablePresentation) {
    this.sendMessage(trackingId, SocketEvent.PresentationAccepted, payload);
  }

  rejectPresentation(trackingId: TrackingId, payload: string) {
    this.sendMessage(trackingId, SocketEvent.PresentationRejected, payload);
  }

  private addSocketToRegistry(trackingId: TrackingId, socket: WebSocket): boolean {
    if (this.websocketRegistry.has(trackingId)) {
      console.warn(`PresentationRequestGateway: attempting to register client with same trackingId of "${trackingId}"`);
      return false;
    }
    this.websocketRegistry.set(trackingId, socket);
    return true;
  }

  private getSocketFromRegistry(trackingId: TrackingId): Maybe<WebSocket> {
    return this.websocketRegistry.get(trackingId);
  }

  private sendMessage(trackingId: string, event: SocketEvent, payload: VerifiablePresentation | string) {
    const clientSocket: Maybe<WebSocket> = this.getSocketFromRegistry(trackingId);
    if (!clientSocket) {
      throw new Error(`no client socket found for trackingId ${trackingId}`);
    }

    clientSocket.send(
      JSON.stringify({
        event,
        data: JSON.stringify(payload)
      })
    );
  }
}
