import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';

import { UserAcceptance, UserRejection } from '@globalid/verifier-toolkit';
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class UserResponsePipe implements PipeTransform<Record<string, unknown>> {
  async transform(value: Record<string, unknown>) {
    const userResponse = this.parse(value);
    try {
      await validateOrReject(userResponse);
    } catch (error) {
      throw new BadRequestException(error);
    }
    return userResponse;
  }

  private parse(value: Record<string, unknown>): UserAcceptance | UserRejection {
    if (value.proof_presentation != null) {
      return plainToInstance(UserAcceptance, value);
    } else if (value.error_msg != null) {
      return plainToInstance(UserRejection, value);
    } else {
      throw new BadRequestException('missing proof_presentation or error_msg');
    }
  }
}
