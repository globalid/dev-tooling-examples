import {
  createPresentationRequestUrl,
  GidVerifierClient,
  UserAcceptance,
  UserRejection,
  UserResponse
} from '@globalid/verifier-toolkit';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ClientService } from './client/client.service';
import { InvalidSignatureError } from './invalid-signature.error';
import { PresentationRequirementsFactory } from './presentation-requirements.factory';
import { QrCodeViewModel } from './qr-code.view-model';

@Injectable()
export class PresentationRequestService {
  private readonly logger = new Logger(PresentationRequestService.name);

  constructor(
    private readonly clientService: ClientService,
    private readonly config: ConfigService,
    private readonly gidVerifierClient: GidVerifierClient,
    private readonly presentationRequirementsFactory: PresentationRequirementsFactory
  ) {}

  createQrCodeViewModel(): QrCodeViewModel {
    const [qrCodeUrl, trackingId] = createPresentationRequestUrl({
      clientId: this.config.get<string>('CLIENT_ID'),
      initiationUrl: `${this.config.get<string>('BASE_URL')}/request-presentation`
    });
    this.logger.log(`generated URL for tracking ID ${trackingId}`);
    return {
      trackingId,
      qrCodeUrl
    };
  }

  requestPresentation(trackingId: string) {
    this.clientService.sendAwaitingResponse(trackingId);
    return this.gidVerifierClient.createPresentationRequest({
      trackingId,
      webhookUrl: `${this.config.get<string>('BASE_URL')}/handle-user-response`,
      presentationRequirements: this.presentationRequirementsFactory.create()
    });
  }

  async handleUserResponse(signature: string, userResponse: UserAcceptance | UserRejection) {
    this.logger.log('verifying signature');
    await this.verifySignature(signature, userResponse);

    if (userResponse instanceof UserAcceptance) {
      this.logger.log('user accepted');
      this.clientService.sendUserAcceptance(userResponse);
    } else {
      this.logger.log('user rejected');
      this.clientService.sendUserRejection(userResponse);
    }
  }

  private async verifySignature(signature: string, userResponse: UserResponse) {
    const isValid = await this.gidVerifierClient.verifySignature(signature, userResponse);
    if (!isValid) {
      throw new InvalidSignatureError();
    }
    return isValid;
  }
}
