import { WebSocket } from 'ws';

import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WsResponse } from '@nestjs/websockets';

import { Maybe, TrackingId } from '../types';
import { RegisterClientEvent, SocketEvent, VerifiablePresentation } from './presentation-request.types';
import { UseFilters } from '@nestjs/common';
import { WebsocketExceptionFilter } from '../filters/ws-filter';
import { TrackingIdValidationPipe } from '../pipes/trackingid-validator';

// TODO remove when config is figured out
const websocketPort = 8080;

@UseFilters(new WebsocketExceptionFilter())
@WebSocketGateway(websocketPort)
export class PresentationRequestGateway {
  private websocketRegistry: Map<TrackingId, WebSocket>;

  constructor() {
    // TODO log host also once config is figured out
    console.log(`websocket server listening on :${websocketPort}`);
    this.websocketRegistry = new Map<TrackingId, WebSocket>();
  }

  @SubscribeMessage('register-client')
  register(
    @ConnectedSocket() client: WebSocket,
    @MessageBody(new TrackingIdValidationPipe()) data: RegisterClientEvent
  ): WsResponse<string> {
    this.addSocketToRegistry(data.trackingId, client);
    return { event: SocketEvent.ClientRegistered, data: 'client successfully registered' };
  }

  @SubscribeMessage('unregister-client')
  unregister(@MessageBody('trackingId') trackingId: string): WsResponse<string> {
    this.removeSocketFromRegistry(trackingId);
    return { event: SocketEvent.ClientUnregistered, data: 'client successfully unregistered' };
  }

  acceptPresentation(trackingId: TrackingId, payload: VerifiablePresentation): void {
    this.sendMessage(trackingId, SocketEvent.PresentationAccepted, payload);
  }

  rejectPresentation(trackingId: TrackingId, payload: string): void {
    this.sendMessage(trackingId, SocketEvent.PresentationRejected, payload);
  }

  awaitResponse(trackingId: string): void {
    this.sendMessage(trackingId, SocketEvent.AwaitingResponse);
  }

  private removeSocketFromRegistry(trackingId: string) {
    this.websocketRegistry.delete(trackingId);
  }

  private addSocketToRegistry(trackingId: TrackingId, socket: WebSocket): void {
    if (this.websocketRegistry.has(trackingId)) {
      console.warn(`PresentationRequestGateway: attempting to register client with same trackingId of "${trackingId}"`);
    }
    this.websocketRegistry.set(trackingId, socket);
  }

  private getSocketFromRegistry(trackingId: TrackingId): Maybe<WebSocket> {
    return this.websocketRegistry.get(trackingId);
  }

  private sendMessage(trackingId: string, event: SocketEvent, payload?: VerifiablePresentation | string) {
    const clientSocket: Maybe<WebSocket> = this.getSocketFromRegistry(trackingId);
    if (!clientSocket) {
      // TODO what should we do here?
      console.error(`no client socket found for trackingId ${trackingId}`);
      return;
    }

    console.log(`sending data over websocket for trackingId ${trackingId}`);
    clientSocket.send(
      JSON.stringify({
        event,
        data: payload && JSON.stringify(payload)
      })
    );
  }
}
