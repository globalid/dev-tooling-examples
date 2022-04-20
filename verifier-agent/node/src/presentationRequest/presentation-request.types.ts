export interface RegisterClientEvent {
  trackingId: string;
}

export enum SocketEvent {
  ClientRegistered = 'client-registered',
  ClientRegisterError = 'client-register-error',
  ClientUnregistered = 'client-unregistered',
  PresentationAccepted = 'presentation-accepted',
  PresentationRejected = 'presentation-rejected'
}

// TODO replace when we know the fields
// interface VerifiablePresentation {}
export type VerifiablePresentation = Record<string, any>;
