import * as crypto from 'crypto';
import { createMock } from '@golevelup/ts-jest';

import { CreatePresentationRequestDto } from './create-presentation-request-dto';
import { EpamClient } from './epam-client';
import { GidVerifierClient } from './gid-verifier-client';
import { createProofRequestAxiosResponse, privateKey, publicKey } from '../../test/common';

describe('GidVerifierClient', () => {
  let client: GidVerifierClient;
  const epamClient = createMock<EpamClient>();
  const createPresentationRequestDto = createMock<CreatePresentationRequestDto>();

  beforeEach(() => {
    client = new GidVerifierClient(epamClient);
  });

  describe('createPresentationRequest', () => {
    it('should call the EPAM service to create proof request', async () => {
      epamClient.createProofRequest.mockResolvedValueOnce(createProofRequestAxiosResponse.data);

      const result: any = await client.createPresentationRequest(createPresentationRequestDto);

      expect(result).toBe(createProofRequestAxiosResponse.data);
      expect(epamClient.createProofRequest).toHaveBeenCalledTimes(1);
      expect(epamClient.createProofRequest).toHaveBeenCalledWith(createPresentationRequestDto);
    });
  });

  describe('verifySignature', () => {
    it('should verify signature with key retrieved from EPAM', async () => {
      const dataToSign: any = { data: 'any-data' };
      const bufferToSign = Buffer.from(JSON.stringify(dataToSign));
      const signature: string = crypto.sign(null, bufferToSign, privateKey).toString('base64');
      epamClient.getPublicKey.mockResolvedValueOnce(publicKey);

      const result: any = await client.verifySignature(signature, dataToSign);

      expect(result).toBe(true);
      expect(epamClient.getPublicKey).toHaveBeenCalledTimes(1);
    });
  });
});
