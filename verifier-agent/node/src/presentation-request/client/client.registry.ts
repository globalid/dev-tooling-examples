import { Socket } from 'socket.io';

import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ClientRegistry {
  private readonly logger = new Logger(ClientRegistry.name);
  private readonly clients = new Map<string, Socket>();

  deregister(trackingId: string): boolean {
    return this.clients.delete(trackingId);
  }

  find(trackingId: string): Socket | undefined {
    return this.clients.get(trackingId);
  }

  register(trackingId: string, client: Socket): void {
    if (this.clients.has(trackingId)) {
      this.logger.warn(`overwriting client (tracking ID: ${trackingId})`);
    }
    this.clients.set(trackingId, client);
  }
}
