import axiosMock from 'jest-mock-axios';

import { createMock } from '@golevelup/ts-jest';

import { accessToken, createPresentationRequestAxiosResponse, publicKey } from '../../test/common';
import { AuthClient } from './auth-client';
import { CreatePresentationRequestDto, PresentationRequestResponseDto } from './create-presentation-request-dto';
import { EpamClient } from './epam-client';

describe('EpamClient', () => {
  let client: EpamClient;
  const authClient = createMock<AuthClient>();
  const createPresentationRequestDto = createMock<CreatePresentationRequestDto>();

  beforeEach(() => {
    authClient.getAppAccessToken.mockResolvedValueOnce(accessToken);
    client = new EpamClient(authClient);
  });

  afterEach(() => {
    axiosMock.reset();
  });

  describe('createPresentationRequest', () => {
    it('should create a Presentation Request', async () => {
      axiosMock.post.mockResolvedValueOnce(createPresentationRequestAxiosResponse);
      const result: PresentationRequestResponseDto = await client.createPresentationRequest(
        createPresentationRequestDto
      );

      expect(result).toBe(createPresentationRequestAxiosResponse.data);
      expect(axiosMock.post).toHaveBeenCalledTimes(1);
      expect(axiosMock.post).toHaveBeenCalledWith(
        '/v2/aries/management/external-party/proof-requests',
        createPresentationRequestDto,
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
