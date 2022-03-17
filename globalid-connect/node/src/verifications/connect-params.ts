import { IsOptional, IsString, IsUUID } from 'class-validator';

export class ConnectParams {
  @IsString()
  code: string;

  @IsOptional()
  @IsUUID('4')
  decoupled_id?: string;
}
