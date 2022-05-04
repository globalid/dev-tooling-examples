export interface RegisterClientEvent {
  trackingId: string;
}

export enum SocketEvent {
  AwaitingResponse = 'awaiting-response',
  ClientRegistered = 'client-registered',
  ClientRegisterError = 'client-register-error',
  ClientUnregistered = 'client-unregistered',
  PresentationAccepted = 'presentation-accepted',
  PresentationRejected = 'presentation-rejected'
}

// TODO replace when we know the fields
export type VerifiablePresentation = Record<string, any>;
