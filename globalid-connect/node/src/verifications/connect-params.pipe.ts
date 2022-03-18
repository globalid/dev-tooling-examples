import { plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';

import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

import { ConnectParams } from './connect-params';
import { ErrorParams } from './error-params';

@Injectable()
export class ConnectParamsPipe implements PipeTransform<Record<string, unknown>> {
  async transform(value: Record<string, unknown>) {
    const params = value.code !== undefined ? plainToClass(ConnectParams, value) : plainToClass(ErrorParams, value);
    try {
      await validateOrReject(params);
    } catch (error) {
      throw new BadRequestException(error);
    }
    return params;
  }
}
