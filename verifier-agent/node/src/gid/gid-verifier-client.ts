import * as crypto from 'crypto';

import { EpamClient } from './epam-client';
import { CreatePresentationRequestDto } from './create-presentation-request-dto';

export class GidVerifierClient {
  constructor(private readonly epamClient: EpamClient) {}

  async createPresentationRequest(createPresentationRequestDto: CreatePresentationRequestDto): Promise<any> {
    return this.epamClient.createPresentationRequest(createPresentationRequestDto);
  }

  async verifySignature(signature: string, data: any): Promise<boolean> {
    const publicKey: string = await this.epamClient.getPublicKey();
    const dataBuffer: Buffer = Buffer.from(JSON.stringify(data));
    const signatureBuffer: Buffer = Buffer.from(signature, 'base64');
    return crypto.verify(null, dataBuffer, publicKey, signatureBuffer);
  }
}
