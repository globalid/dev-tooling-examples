import { AuthClient } from './auth-client';
import axios from './axios';
import { ProofRequestResponseDto } from './create-presentation-request-dto';
import { CreateProofRequestDto } from './create-proof-request-dto';

export class EpamClient {
  constructor(private readonly authClient: AuthClient) {}

  async createProofRequest(
    createProofRequestDto: CreateProofRequestDto
  ): Promise<ProofRequestResponseDto> {
    const accessToken = await this.authClient.getAppAccessToken();
    const response = await axios.post<ProofRequestResponseDto>(
      '/v2/aries/management/external-party/proof-requests',
      createProofRequestDto,
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );

    return response.data;
  }

  async getPublicKey(): Promise<string> {
    const response = await axios.get<PublicKeyResponse>('/v2/aries/management/external-party/public-key');
    return response.data.public_key;
  }
}

interface PublicKeyResponse {
  public_key: string;
}
