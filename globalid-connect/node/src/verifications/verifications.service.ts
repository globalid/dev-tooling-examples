import { Attestation, GidApiClientFactory } from '@globalid/api-client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class VerificationsService {
  constructor(
    private readonly gidApiClientFactory: GidApiClientFactory,
  ) {}

  async getAttestations(code: string): Promise<Attestation[]> {
    return (await this.gidApiClientFactory.create(code)).attestations.get();
  }
}
