import { IsString } from 'class-validator';

export class ConnectParams {
  @IsString()
  code: string;
}
