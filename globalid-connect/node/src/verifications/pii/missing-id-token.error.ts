import { HttpException, HttpStatus } from '@nestjs/common';

export class MissingIdTokenError extends HttpException {
  constructor() {
    super('Could not get ID token for user', HttpStatus.BAD_REQUEST);
  }
}
