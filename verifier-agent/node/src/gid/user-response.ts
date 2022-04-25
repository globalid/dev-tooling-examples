import { IsUUID } from 'class-validator';
import { VerifiablePresentation } from '../presentation-request/presentation-request.types';

abstract class UserResponse {
  @IsUUID('4')
  app_uuid: string;
  tracking_id: string;
  thread_id: string;
  state: UserResponseState;
  verified: boolean;
}

export enum UserResponseState {
  Abandoned = 'abandoned',
  Done = 'done'
}

export class UserAcceptance extends UserResponse {
  proof_presentation: VerifiablePresentation;
}

export class UserRejection {
  error_msg: string;
}
