import { BadRequestException } from '@nestjs/common';

export class InvalidSignatureError extends BadRequestException {
  constructor() {
    super('Message signature is invalid');
  }
}
