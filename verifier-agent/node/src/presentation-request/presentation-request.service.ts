import {
  createPresentationRequestUrl,
  GidVerifierClient,
  HolderAcceptance,
  HolderRejection,
  HolderResponse
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
      webhookUrl: `${this.config.get<string>('BASE_URL')}/handle-response`,
      presentationRequirements: this.presentationRequirementsFactory.create()
    });
  }

  async handleResponse(signature: string, holderResponse: HolderAcceptance | HolderRejection) {
    this.logger.log('verifying signature');
    await this.verifySignature(signature, holderResponse);

    if (holderResponse instanceof HolderAcceptance) {
      this.logger.log('holder accepted');
      this.clientService.sendAcceptance(holderResponse);
      /*****************************************
       * Janusea API call goes here. The payload is in holderResponse.proofPresentation
       *****************************************/
      // this.logger.log(holderResponse.proofPresentation);
    } else {
      this.logger.log('holder rejected');
      this.clientService.sendRejection(holderResponse);
    }
  }

  private async verifySignature(signature: string, holderResponse: HolderResponse) {
    const isValid = await this.gidVerifierClient.verifySignature(signature, holderResponse);
    if (!isValid) {
      throw new InvalidSignatureError();
    }
    return isValid;
  }
}
