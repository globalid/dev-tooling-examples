import * as crypto from 'crypto';

import { EpamClient } from './epam-client';
import { CreateProofRequestDto as CreatePresentationRequestDto } from './create-proof-request-dto';

export class GidVerifierClient {
  constructor(private readonly epamClient: EpamClient) {}

  async createPresentationRequest(createProofRequestDto: CreatePresentationRequestDto): Promise<any> {
    return this.epamClient.createProofRequest(createProofRequestDto);
  }

  async verifySignature(signature: string, data: any): Promise<boolean> {
    const publicKey: string = await this.epamClient.getPublicKey();
    const dataBuffer: Buffer = Buffer.from(JSON.stringify(data));
    const signatureBuffer: Buffer = Buffer.from(signature, 'base64');
    return crypto.verify(null, dataBuffer, publicKey, signatureBuffer);
  }
}
