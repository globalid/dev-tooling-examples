export enum ServerEvent {
  AwaitingResponse = 'awaiting-response',
  PresentationAccepted = 'presentation-accepted',
  PresentationRejected = 'presentation-rejected',
  InvalidIdType = 'invalid-id-type',
  SomethingWentWrong = 'something-went-wrong',
  TimeoutError = 'timeout-error',
  AlreadyCreated = 'already-created',
}
