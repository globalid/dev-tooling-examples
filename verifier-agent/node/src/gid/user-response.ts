import { IsUUID } from 'class-validator';
import { VerifiablePresentation } from '../presentation-request/presentation-request.types';

export class UserAcceptance {
  proof_presentation: VerifiablePresentation;
}

abstract class UserResponse {
  @IsUUID('4')
  app_uuid: string;
  tracking_id: string;
  thread_id: string;
  state: UserResponseState;
  verified: boolean;
}

enum UserResponseState {
  Abandoned = 'abandoned',
  Done = 'done'
}
