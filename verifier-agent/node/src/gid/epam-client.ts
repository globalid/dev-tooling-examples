import { AuthClient } from './auth-client';
import axios from './axios';
import { CreateProofRequestDto } from './create-proof-request-dto';

export class EpamClient {
  constructor(private readonly authClient: AuthClient) {}

  async createProofRequest(createProofRequestDto: CreateProofRequestDto): Promise<any> {
    const response = await axios.post(
      '/v2/aries/management/external-party/proof-requests',
      {
        proof_requirements: createProofRequestDto.presentationRequirements,
        tracking_id: createProofRequestDto.trackingId,
        screening_webhook_url: createProofRequestDto.webhookUrl
      },
      {
        headers: { Authorization: `Bearer ${await this.authClient.getAppAccessToken()}` }
      }
    );

    return response.data;
  }
}
