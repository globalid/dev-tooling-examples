import { Socket } from 'socket.io';

import { UserAcceptance, UserRejection } from '@globalid/verifier-toolkit';
import { Injectable, Logger } from '@nestjs/common';

import { ClientRegistry } from './client.registry';
import { ServerEvent } from './server-event';

@Injectable()
export class ClientService {
  private readonly logger = new Logger(ClientService.name);

  constructor(private readonly registry: ClientRegistry) {}

  sendUserAcceptance(acceptance: UserAcceptance): void {
    this.emitEvent(ServerEvent.PresentationAccepted, acceptance.trackingId, acceptance);
  }

  sendAwaitingResponse(trackingId: string): void {
    this.emitEvent(ServerEvent.AwaitingResponse, trackingId);
  }

  deregister(trackingId: string): void {
    this.registry.deregister(trackingId);
  }

  register(trackingId: string, client: Socket): void {
    this.registry.register(trackingId, client);
  }

  sendUserRejection(rejection: UserRejection): void {
    this.emitEvent(ServerEvent.PresentationRejected, rejection.trackingId, rejection);
  }

  private emitEvent(event: ServerEvent, trackingId: string, payload?: any) {
    const client = this.registry.find(trackingId);
    if (client === undefined) {
      this.logger.error(`no client socket found (tracking ID: ${trackingId})`);
      return;
    }

    this.logger.log(`emitting ${event} event (tracking ID: ${trackingId})`);
    client.emit(event, payload);
  }
}
