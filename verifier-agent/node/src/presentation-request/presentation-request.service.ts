import { ScreeningClaim } from 'src/screening/screening-claim.entity';

import {
  createPresentationRequestUrl,
  GidVerifierClient,
  HolderAcceptance,
  HolderRejection,
  HolderResponse
} from '@globalid/verifier-toolkit';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Screening } from '../screening/screening.entity';
import { ScreeningService } from '../screening/screening.service';
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
    private readonly presentationRequirementsFactory: PresentationRequirementsFactory,
    private readonly screeningService: ScreeningService
  ) {}

  createQrCodeViewModel(): QrCodeViewModel {
    const [qrCodeUrl, trackingId] = createPresentationRequestUrl({
      clientId: this.config.get<string>('CLIENT_ID'),
      initiationUrl: `${this.config.get('BASE_URL')}/request-presentation`
    });
    this.logger.log(`generated URL for tracking ID ${trackingId}`);
    return {
      wsUrl: this.config.get('BASE_URL'),
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
      await this.saveScreening(holderResponse);
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

  private async saveScreening(response: HolderAcceptance) {
    const screening = this.convertResponseToScreening(response);
    this.screeningService.save(screening);
  }

  private convertResponseToScreening(response: HolderAcceptance) {
    const { credentialSubject } = response.proofPresentation.dif.verifiableCredential[0];
    const screening = new Screening();
    screening.subject = credentialSubject.id;
    screening.screenedOn = new Date().toISOString();
    screening.claims = Object.entries(credentialSubject)
      .filter(([label]) => !['id', 'type'].includes(label))
      .map(([label, value]) => {
        const claim = new ScreeningClaim();
        claim.label = label;
        claim.value = String(value);
        claim.screening = screening;
        return claim;
      });
    return screening;
  }
}
