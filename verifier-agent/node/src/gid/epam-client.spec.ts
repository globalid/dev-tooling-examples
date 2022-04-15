import axiosMock from 'jest-mock-axios';

import { createMock } from '@golevelup/ts-jest';

import { AuthClient } from './auth-client';
import { EpamClient } from './epam-client';
import { accessToken, createProofRequestAxiosResponse } from '../../test/common';
import { CreateProofRequestDto } from './create-proof-request-dto';

describe('EpamClient', () => {
  let client: EpamClient;
  const authClient = createMock<AuthClient>();
  const createProofRequestDto = createMock<CreateProofRequestDto>();

  beforeEach(() => {
    authClient.getAppAccessToken.mockResolvedValueOnce(accessToken);
    client = new EpamClient(authClient);
    axiosMock.post.mockResolvedValueOnce(createProofRequestAxiosResponse);
  });

  afterEach(() => {
    axiosMock.reset();
  });

  describe('createProofRequest', () => {
    it('should call the EPAM proof requests API', async () => {
      const result: any = await client.createProofRequest(createProofRequestDto);

      expect(result).toBe(createProofRequestAxiosResponse.data);
      expect(axiosMock.post).toHaveBeenCalledTimes(1);
      expect(axiosMock.post).toHaveBeenCalledWith(
        '/v2/aries/management/external-party/proof-requests',
        {
          proof_requirements: createProofRequestDto.presentationRequirements,
          tracking_id: createProofRequestDto.trackingId,
          screening_webhook_url: createProofRequestDto.webhookUrl
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );
    });
  });
});
