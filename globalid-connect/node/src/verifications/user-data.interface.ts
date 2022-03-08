import { Attestation, Identity, Pii } from '@globalid/api-client';

export interface UserData {
  attestations: Attestation[];
  identity: Identity;
  pii?: Pii[];
}
