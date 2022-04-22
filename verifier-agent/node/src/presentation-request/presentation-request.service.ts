import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthClient } from '../gid/auth-client';
import { EpamClient } from '../gid/epam-client';
import { GidVerifierClient } from '../gid/gid-verifier-client';
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
    if(!this.gidVerifierClient.verifySignature(signature, userResponse)) {
      throw new Error('invalid signature');
    }
  }
}
