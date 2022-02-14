import { Controller, Get, Query } from '@nestjs/common';
import { Attestation } from './attestation.interface';
import { AttestationsService } from './attestations.service';

@Controller('verifications')
export class AttestationsController {
  constructor(private readonly attestationsService: AttestationsService) {}

  @Get('connect/attestations')
  index(@Query('code') code: string): Promise<Attestation[]> {
    return this.attestationsService.get(code);
  }
}
