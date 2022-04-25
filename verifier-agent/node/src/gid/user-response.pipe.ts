import { plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';

import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { UserAcceptance, UserRejection } from './user-response';

@Injectable()
export class UserResponsePipe implements PipeTransform<Record<string, unknown>> {
  async transform(value: Record<string, unknown>) {
    const params = this.parse(value);
    try {
      await validateOrReject(params);
    } catch (error) {
      throw new BadRequestException(error);
    }
    return params;
  }

  private parse(value: Record<string, unknown>): UserAcceptance | UserRejection {
    if (value.error_msg != null) {
      return plainToClass(UserRejection, value);
    }
    return plainToClass(UserAcceptance, value);
  }
}
