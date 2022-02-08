import { Injectable } from '@nestjs/common';

import { PiiService } from './pii/pii.service';

@Injectable()
export class VerificationsService {
  constructor(private readonly piiService: PiiService) {}

  async getPii(code: string) {
    return this.piiService.get(code);
  }
}
