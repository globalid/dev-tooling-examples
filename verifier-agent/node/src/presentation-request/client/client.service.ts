import { Socket } from 'socket.io';

import { HolderAcceptance, HolderRejection } from '@globalid/verifier-toolkit';
import { Injectable, Logger } from '@nestjs/common';

import { ClientRegistry } from './client.registry';
import { ServerEvent } from './server-event';
import { ErrorInfoJanusea } from './error-event';

@Injectable()
export class ClientService {
  private readonly logger = new Logger(ClientService.name);

  constructor(private readonly registry: ClientRegistry) {}

  sendAcceptance(acceptance: HolderAcceptance): void {
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

  sendRejection(rejection: HolderRejection): void {
    const errorInfo : ErrorInfoJanusea = {
      title: 'Did you miss something?',
      message: 'You declined to share your personal data',
      isQuestionDisplayed: true
    }
    this.emitJanuseaErrorEvent(ServerEvent.PresentationRejected, rejection.trackingId, errorInfo);
  }

  sendInvalidIdType(acceptance: HolderAcceptance): void {
    const errorInfo : ErrorInfoJanusea = {
      title: 'Oops',
      message: 'Unfortunately, you cannot open an account based on the document information you provided. The account can be opened only for US residents with a SSN or an ITIN.',
      isQuestionDisplayed: false
    }
    this.emitJanuseaErrorEvent(ServerEvent.InvalidIdType, acceptance.trackingId, errorInfo);
  }

  sendSomethingWentWrong(acceptance: HolderAcceptance): void {
    const errorInfo : ErrorInfoJanusea = {
      title: 'Oops',
      message: 'Something went wrong. Please try again.',
      isQuestionDisplayed: false
    }
    this.emitJanuseaErrorEvent(ServerEvent.SomethingWentWrong, acceptance.trackingId, errorInfo);
  }

  sendTimeoutError(acceptance: HolderAcceptance): void {
    const errorInfo : ErrorInfoJanusea = {
      title: 'Oops',
      message: 'The system is having temporary difficulties. Please try again.',
      isQuestionDisplayed: false
    }
    this.emitJanuseaErrorEvent(ServerEvent.TimeoutError, acceptance.trackingId, errorInfo);
  }

  sendAlreadyCreatedMessage(acceptance: HolderAcceptance): void {
    // TODO: This isn't a QR code load. Need to render something similar to what's generated in sendAcceptance()
    this.emitEvent(ServerEvent.AlreadyCreated, acceptance.trackingId, acceptance);
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

  private emitJanuseaErrorEvent(event: ServerEvent, trackingId: string, payload: ErrorInfoJanusea) {
    const client = this.registry.find(trackingId);
    if (client === undefined) {
      this.logger.error(`no client socket found (tracking ID: ${trackingId})`);
      return;
    }

    this.logger.log(`emitting ${event} event (tracking ID: ${trackingId})`);
    client.emit(event, payload);
  }

}
