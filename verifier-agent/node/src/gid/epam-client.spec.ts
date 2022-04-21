import axiosMock from 'jest-mock-axios';

import { createMock } from '@golevelup/ts-jest';

import { accessToken, createProofRequestAxiosResponse, publicKey } from '../../test/common';
import { AuthClient } from './auth-client';
import { CreatePresentationRequestDto, ProofRequestResponseDto } from './create-presentation-request-dto';
import { EpamClient } from './epam-client';
import { CreateProofRequestDto } from './create-proof-request-dto';

describe('EpamClient', () => {
  let client: EpamClient;
  const authClient = createMock<AuthClient>();
  const createProofRequestDto = createMock<CreateProofRequestDto>();

  beforeEach(() => {
    authClient.getAppAccessToken.mockResolvedValueOnce(accessToken);
    client = new EpamClient(authClient);
  });

  afterEach(() => {
    axiosMock.reset();
  });

  describe('createProofRequest', () => {
    it('should create a Presentation Request', async () => {
      axiosMock.post.mockResolvedValueOnce(createProofRequestAxiosResponse);
      const result: ProofRequestResponseDto = await client.createProofRequest(
        createProofRequestDto
      );

      expect(result).toBe(createProofRequestAxiosResponse.data);
      expect(axiosMock.post).toHaveBeenCalledTimes(1);
      expect(axiosMock.post).toHaveBeenCalledWith(
        '/v2/aries/management/external-party/proof-requests',
        createProofRequestDto,
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );
    });
  });

  describe('getPublicKey', () => {
    it('should get the public key', async () => {
      axiosMock.get.mockResolvedValueOnce({ data: { public_key: publicKey } });
      const result: string = await client.getPublicKey();

      expect(result).toBe(publicKey);
      expect(axiosMock.get).toHaveBeenCalledTimes(1);
    });
  });
});
