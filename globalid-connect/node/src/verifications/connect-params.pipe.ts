import { plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';

import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

import { ConnectParams } from './connect-params';
import { ErrorParams } from './error-params';

@Injectable()
export class ConnectParamsPipe implements PipeTransform<Record<string, unknown>> {
  async transform(value: Record<string, unknown>) {
    const params = this.parse(value);
    try {
      await validateOrReject(params);
    } catch (error) {
      throw new BadRequestException(error);
    }
    return params;
  }

  private parse(value: Record<string, unknown>): ConnectParams | ErrorParams {
    if (value.code === undefined) {
      const error = plainToClass(ErrorParams, value);
      error.errorDescription = decodeURIComponent(error.errorDescription);
      return error;
    }
    return plainToClass(ConnectParams, value);
  }
}
