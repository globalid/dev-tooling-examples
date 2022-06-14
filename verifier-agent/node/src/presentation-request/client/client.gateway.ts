import { Socket } from 'socket.io';

import { Logger } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

import { ClientService } from './client.service';

@WebSocketGateway({ transports: ['websocket'] })
export class ClientGateway {
  private readonly logger = new Logger(ClientGateway.name);

  constructor(private readonly clientService: ClientService) {}

  @SubscribeMessage('register-client')
  register(@ConnectedSocket() client: Socket, @MessageBody() trackingId: string): string {
    this.logger.log(`registering client (tracking ID: ${trackingId})`);
    this.clientService.register(trackingId, client);
    return `client successfully registered with tracking ID ${trackingId}`;
  }

  @SubscribeMessage('deregister-client')
  deregister(@MessageBody() trackingId: string): string {
    this.logger.log(`removing socket for (tracking ID: ${trackingId})`);
    this.clientService.deregister(trackingId);
    return `client successfully deregistered with tracking ID ${trackingId}`;
  }
}
