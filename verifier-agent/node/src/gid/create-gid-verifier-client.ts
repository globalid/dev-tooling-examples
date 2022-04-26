import { AuthClient } from './auth-client';
import { EpamClient } from './epam-client';
import { GidVerifierClient } from './gid-verifier-client';

export interface GidVerifierClientOptions {
  clientId: string;
  clientSecret: string;
}

export const createGidVerifierClient = (options: GidVerifierClientOptions): GidVerifierClient => {
  const { clientId, clientSecret } = options;

  const epamClient: EpamClient = new EpamClient(new AuthClient(clientId, clientSecret));
  return new GidVerifierClient(epamClient);
};
