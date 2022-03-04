import { Attestation, Identity, Pii } from '@globalid/api-client';

export interface ApiClientData {
  attestations: Attestation[];
  identity: Identity;
  pii?: Pii[];
}
