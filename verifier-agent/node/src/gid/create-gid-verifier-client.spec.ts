
import { clientId, clientSecret } from '../../test/common';
import { GidVerifierClientOptions, createGidVerifierClient } from './create-gid-verifier-client';
import { GidVerifierClient } from './gid-verifier-client';
import { AuthClient } from './auth-client';
import { EpamClient } from './epam-client';

jest.mock('./auth-client');
jest.mock('./epam-client');
jest.mock('./gid-verifier-client');

describe('createGidVerifierClient', () => {
  const options: GidVerifierClientOptions = {
    clientId,
    clientSecret
  };

  it('should return an GidVerifierClient instance', async () => {
    const gidVerifierClient: GidVerifierClient = createGidVerifierClient(options);

    expect(gidVerifierClient).toBeInstanceOf(GidVerifierClient);
    expect(AuthClient).toHaveBeenCalledTimes(1);
    expect(AuthClient).toHaveBeenCalledWith(clientId, clientSecret);
    expect(EpamClient).toHaveBeenCalledTimes(1);
    expect(EpamClient).toHaveBeenCalledWith(expect.any(AuthClient));
    expect(GidVerifierClient).toHaveBeenCalledTimes(1);
    expect(GidVerifierClient).toHaveBeenCalledWith(expect.any(EpamClient));
  });
});
