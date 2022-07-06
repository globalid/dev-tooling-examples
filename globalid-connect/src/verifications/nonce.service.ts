import { v4 as uuid } from 'uuid';

import { Injectable } from '@nestjs/common';

@Injectable()
export class NonceService {
  generate(): string {
    return uuid();
  }
}
