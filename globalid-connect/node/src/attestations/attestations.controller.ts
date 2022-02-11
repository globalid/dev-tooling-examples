import { Controller, Get } from '@nestjs/common';
import { AttestationsService } from './attestations.service';

@Controller('attestations')
export class AttestationsController {
  constructor(private readonly attestationsService: AttestationsService) {}

  @Get()
  index() {
    return this.attestationsService.getAttestations();
  }  
}
