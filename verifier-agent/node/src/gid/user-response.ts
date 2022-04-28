import { IsBoolean, IsEnum, IsString, IsUUID, ValidateNested } from 'class-validator';
import { VerifiablePresentation } from '../presentation-request/presentation-request.types';

export enum UserResponseState {
  Abandoned = 'abandoned',
  Done = 'done'
}

abstract class UserResponse {
  @IsUUID('4')
  app_uuid: string;
  @IsString()
  tracking_id: string;
  @IsString()
  thread_id: string;
  @IsEnum(UserResponseState)
  state: UserResponseState;
  @IsBoolean()
  verified: boolean;
}

export class UserAcceptance extends UserResponse {
  @ValidateNested()
  proof_presentation: VerifiablePresentation;
}

export class UserRejection extends UserResponse {
  @IsString()
  error_msg: string;
}
