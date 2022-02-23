import { Controller, Get, Logger, Query } from '@nestjs/common';
import { configValidationStructure } from '../../config';
import { Attestation } from './attestation.interface';
import { AttestationsService } from './attestations.service';

@Controller('verifications')
export class AttestationsController {
  private readonly logger = new Logger(AttestationsController.name);

  constructor(private readonly attestationsService: AttestationsService) {}

  @Get('connect/attestations')
  getAttestations(@Query('code') code: string): Promise<Attestation[]> {
    this.logger.log('Config fdsafda', JSON.stringify(Object.keys(configValidationStructure)));
    return this.attestationsService.getAttestations(code);
  }
}
