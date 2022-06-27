import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';

import { HolderAcceptance, HolderRejection } from '@globalid/verifier-toolkit';
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class HolderResponsePipe implements PipeTransform<Record<string, unknown>> {
  async transform(value: Record<string, unknown>) {
    const HolderResponse = this.parse(value);
    try {
      await validateOrReject(HolderResponse);
    } catch (error) {
      throw new BadRequestException(error);
    }
    return HolderResponse;
  }

  private parse(value: Record<string, unknown>): HolderAcceptance | HolderRejection {
    if (value.proof_presentation != null) {
      return plainToInstance(HolderAcceptance, value);
    } else if (value.error_msg != null) {
      return plainToInstance(HolderRejection, value);
    } else {
      throw new BadRequestException('missing proof_presentation or error_msg');
    }
  }
}
