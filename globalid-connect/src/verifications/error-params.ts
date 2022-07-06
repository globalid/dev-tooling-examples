import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class ErrorParams {
  @IsString()
  error: string;

  @Expose({ name: 'error_description' })
  @IsString()
  errorDescription: string;
}
