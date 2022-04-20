import * as crypto from 'crypto';
import { createMock } from '@golevelup/ts-jest';

import { CreateProofRequestDto } from './create-proof-request-dto';
import { EpamClient } from './epam-client';
import { GidVerifierClient } from './gid-verifier-client';
import { createProofRequestAxiosResponse, privateKey, publicKey } from '../../test/common';

describe('GidVerifierClient', () => {
  let client: GidVerifierClient;
  const epamClient = createMock<EpamClient>();
  const createProofRequestDto = createMock<CreateProofRequestDto>();

  beforeEach(() => {
    epamClient.createProofRequest.mockResolvedValueOnce(createProofRequestAxiosResponse.data);
    epamClient.getPublicKey.mockResolvedValueOnce(publicKey);
    client = new GidVerifierClient(epamClient);
  });

  describe('createPresentationRequest', () => {
    it('should call the EPAM service to create proof request', async () => {
      const result: any = await client.createPresentationRequest(createProofRequestDto);

      expect(result).toBe(createProofRequestAxiosResponse.data);
      expect(epamClient.createProofRequest).toHaveBeenCalledTimes(1);
      expect(epamClient.createProofRequest).toHaveBeenCalledWith(createProofRequestDto);
    });
  });

  describe('verifySignature', () => {
    it('should verify signature with key retrieved from EPAM', async () => {
      const dataToSign: any = { data: 'any-data' };
      const bufferToSign = Buffer.from(JSON.stringify(dataToSign));
      const signature: string = crypto.sign(null, bufferToSign, privateKey).toString('base64');

      const result: any = await client.verifySignature(signature, dataToSign);

      expect(result).toBe(true);
    });
  });
});
