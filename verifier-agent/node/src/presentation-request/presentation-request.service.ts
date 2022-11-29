import {
  createPresentationRequestUrl,
  GidVerifierClient,
  HolderAcceptance,
  HolderRejection,
  HolderResponse,
  PresentationRequirements
} from '@globalid/verifier-toolkit';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ClientService } from './client/client.service';
import { InvalidSignatureError } from './invalid-signature.error';
import { PresentationRequirementsFactory } from './factory/presentation-requirements.factory';
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

  async createQrCodeViewModel(name?: string): Promise<QrCodeViewModel> {
    const requirements = this.presentationRequirementsFactory.list();
    const selectedRequirement = await this.getSelectedRequirement(name);
    const [qrCodeUrl, trackingId] = createPresentationRequestUrl({
      clientId: this.config.get<string>('CLIENT_ID'),
      initiationUrl: `${this.config.get('BASE_URL')}/request-presentation/${selectedRequirement.name}`
    });

    this.logger.log(`generated URL for tracking ID ${trackingId}`);

    return {
      wsUrl: this.config.get('BASE_URL'),
      requirements: requirements.map((r) => ({
        value: r.name,
        name: r.name,
        selected: r.name === selectedRequirement.name
      })),
      selectedRequirement: {
        flowName: selectedRequirement.name,
        purpose: selectedRequirement.purpose
      },
      trackingId,
      qrCodeUrl
    };
  }

  requestPresentation(name: string, trackingId: string) {
    const presentationRequirements = this.presentationRequirementsFactory.create(name);
    this.clientService.sendAwaitingResponse(trackingId);
    return this.gidVerifierClient.createPresentationRequest({
      trackingId,
      webhookUrl: `${this.config.get<string>('BASE_URL')}/handle-response`,
      presentationRequirements
    });
  }

  async handleResponse(signature: string, holderResponse: HolderAcceptance | HolderRejection) {
    this.logger.log('verifying signature');
    await this.verifySignature(signature, holderResponse);

    if (holderResponse instanceof HolderAcceptance) {
      this.logger.log('holder accepted');
      this.clientService.sendAcceptance(holderResponse);
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

  private async getSelectedRequirement(name?: string): Promise<PresentationRequirements> {
    if (!name) {
      return this.presentationRequirementsFactory.list()[0];
    } else {
      return this.presentationRequirementsFactory.create(name);
    }
  }
}
