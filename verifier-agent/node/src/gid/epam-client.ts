import { AuthClient } from './auth-client';
import axios from './axios';
import { CreateProofRequestDto } from './create-proof-request-dto';

export class EpamClient {
  constructor(private readonly authClient: AuthClient) {}

  async createProofRequest(createProofRequestDto: CreateProofRequestDto): Promise<any> {
    const accessToken = await this.authClient.getAppAccessToken();
    const response = await axios.post('/v2/aries/management/external-party/proof-requests', createProofRequestDto, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    return response.data;
  }
}
