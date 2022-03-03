import { GidApiClientFactory } from '@globalid/api-client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class VerificationsService {
  constructor(private readonly gidApiClientFactory: GidApiClientFactory) {}

  async connect(code: string) {
    const client = await this.gidApiClientFactory.create(code);
    return {
      attestations: await client.attestations.get(),
      identity: await client.identity.get(),
      pii: await client.pii?.get()
    };
  }
}
