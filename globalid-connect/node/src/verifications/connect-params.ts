import { Expose } from 'class-transformer';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class ConnectParams {
  @IsString()
  code: string;

  @Expose({ name: 'decoupled_id' })
  @IsOptional()
  @IsUUID('4')
  decoupledId?: string;
}
