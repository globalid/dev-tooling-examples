import { Controller, Get } from '@nestjs/common';
import { Attestation } from './attestation.interface';
import { AttestationsService } from './attestations.service';

@Controller('attestations')
export class AttestationsController {
  constructor(private readonly attestationsService: AttestationsService) {}

  @Get()
  index(): Promise<Attestation[]> {
    return this.attestationsService.getAttestations();
  }
}
