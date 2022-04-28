import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GidVerifierClient } from '../gid/gid-verifier-client';
import { InvalidSignatureError } from '../invalid-signature-error';
import { PresentationRequirementsFactory } from './presentation-requirements.factory';

@Injectable()
export class PresentationRequestService {
  constructor(
    private readonly config: ConfigService,
    private readonly gidVerifierClient: GidVerifierClient,
    private readonly presentationRequirementsFactory: PresentationRequirementsFactory
  ) {}

  async requestPresentation(trackingId: string) {
    return this.gidVerifierClient.createPresentationRequest({
      trackingId,
      webhookUrl: `${this.config.get<string>('BASE_URL')}/handle-user-response`,
      presentationRequirements: this.presentationRequirementsFactory.create()
    });
  }

  async verifySignature(signature: string, userResponse: any) {
    const signatureVerified = await this.gidVerifierClient.verifySignature(signature, userResponse);
    if (!signatureVerified) {
      throw new InvalidSignatureError();
    }
    return signatureVerified;
  }
}
