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

const axios = require('axios');

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

  parseCredentialData(holderResponse: HolderAcceptance) : Object {
    let data = holderResponse.proofPresentation.dif.verifiableCredential[0].credentialSubject;
    delete data['id']; // ID of the proof request, which isn't needed
    delete data['type'];
    
    // Change some keys to match the Janusea API
    data['full_legal_name'] = data['full_name_legal'];
    delete data['full_name_legal'];

    data['email_address'] = data['email'];
    delete data['email'];

    data['full_residence_address'] = data['address_full'];
    delete data['address_full'];

    // Check if '+1' is in the phone number
    // TODO: Speak with Janusea team about what phone number format they want
    if (data['phone_number'].includes('+1')) {
      data['phone_number'] = data['phone_number'].substring(2, 5) + '-' + data['phone_number'].substring(5, 8) + '-' + data['phone_number'].substring(8, 12);
    }

    return data;
  }

  async postToJanusea(holderResponse: HolderAcceptance) {
    // Parse the data and re-name keys to match the Janusea API
    const data = this.parseCredentialData(holderResponse);


    // // Send the post request to the Janusea API
    let config = {
      headers: {
        'X-HTTP-Method-Override': 'POST',
      }
    }
    this.logger.log("Got here");
    axios.post('https://eco.kivagroup.com/bonifii/membership', data, config).then(res => {
      this.logger.log(`statusCode: ${res.status}`);
      this.logger.log(res.data);

      holderResponse['loneStarAccountNumber'] = res.data['membershipId'];
      this.clientService.sendAcceptance(holderResponse);

      // this.pollForAccountCreationStatus(); // Poll for the account creation status
    }).catch(err => {
      this.logger.log("Request error");
      this.logger.log(err);
      this.logger.log(err.response.data);
      this.logger.log(err.response.status);
      holderResponse['loneStarAccountNumber'] = "0000000000";
      this.clientService.sendAcceptance(holderResponse);
    });
  }

  async handleResponse(signature: string, holderResponse: HolderAcceptance | HolderRejection) {
    this.logger.log('verifying signature');
    await this.verifySignature(signature, holderResponse);

    if (holderResponse instanceof HolderAcceptance) {
      this.logger.log('holder accepted');

      this.clientService.sendAcceptance(holderResponse);

      /********** Janusea account creation ***********/
      // this.postToJanusea(holderResponse).then( () => {
      //   this.logger.log('Account creation request sent');
      //   this.clientService.sendAcceptance(holderResponse);
      // }).catch(err => {
      //   this.logger.log(err);
      //   this.logger.log(err.response.data);
      //   this.logger.log(err.response.status);
      // });
      /**********************************************/
      // this.clientService.sendAcceptance(holderResponse);
    // } else {
    //   this.logger.log('holder rejected');
    //   this.clientService.sendRejection(holderResponse);
    }
  }

  // async handleResponse(signature: string, holderResponse: HolderAcceptance | HolderRejection) {
  //   this.logger.log('verifying signature');
  //   await this.verifySignature(signature, holderResponse);

  //   if (holderResponse instanceof HolderAcceptance) {
  //     this.logger.log('holder accepted');
  //     this.clientService.sendAcceptance(holderResponse);
  //   } else {
  //     this.logger.log('holder rejected');
  //     this.clientService.sendRejection(holderResponse);
  //   }
  // }

  private async verifySignature(signature: string, holderResponse: HolderResponse) {
    const isValid = await this.gidVerifierClient.verifySignature(signature, holderResponse);
    if (!isValid) {
      throw new InvalidSignatureError();
    }
    return isValid;
  }
}
