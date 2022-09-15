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

import axios from 'axios';

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

    // Check the ID type format
    if (data['id_type'].includes('SSN')) data['id_type'] = 'SSN';
    else if (data['id_type'].includes('ITIN')) data['id_type'] = 'ITIN';
    else if (data['id_type'].includes('ATIN')) data['id_type'] = 'ATIN';
    else {
      this.clientService.sendInvalidIdType(holderResponse);
    }

    // Strip the dashes from the SSN, and also check if it's 9 digits
    data['id_number'] = data['id_number'].replace('-', '');
    if (data['id_number'].length != 9) {
      this.clientService.sendInvalidIdType(holderResponse);
    }

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
    // this.logger.log(data);


    // // Send the post request to the Janusea API
    let config = {
      headers: {
        'X-HTTP-Method-Override': 'POST',
      }
    }
    this.logger.log("Got here");
    axios.post('https://eco.kivagroup.com/bonifii/membership', data, config).then(res => {
      // If we get a success response, we can accept the credential and send the user to the "account created" page
      this.logger.log('Account creation successful');
      // this.logger.log(res.data);

      // Set the account number so we can display it later
      holderResponse['loneStarAccountNumber'] = res.data['membershipId'];
      this.clientService.sendAcceptance(holderResponse);
    }).catch(err => {
      holderResponse['loneStarAccountNumber'] = "0000000000";
      if (err.response){
        // Request was sent and server responded with non 2xx status code
        this.logger.log("Error creating account");
        const message = err.response.data.error.message;

        // XML validation failing means bad input in the body of the request. Most likely 
        if(message == "Bad Request - XML Validation Failed") {
          this.clientService.sendSomethingWentWrong(holderResponse);
        } else if(message == "Value must contain a valid phone number") {
          // TODO: Let's ask Janusea about phone number format and sync on GlobalID's end
          // For now, I'm manually attempting to parse the phone number, and we'll send 
          // to a "something went wrong" page if the parsing function doens't work
          this.clientService.sendSomethingWentWrong(holderResponse);
        } else if(message == "TIN matches an existing SSN or ITIN or ATIN") {
          // TODO: How do we get the account number if it's already created? Can we query by SSN/ITIN?
          this.clientService.sendAlreadyCreatedMessage(holderResponse);
        }
      } else if (err.request) {
        // The request was made but no response was received within the timeout range
        this.clientService.sendTimeoutError(holderResponse);
      } else {
        // Something happened in setting up the request that triggered an Error
        // TODO: Send user to "something went wrong" page
        this.clientService.sendSomethingWentWrong(holderResponse);
      }
    });
  }

  async handleResponse(signature: string, holderResponse: HolderAcceptance | HolderRejection) {
    this.logger.log('verifying signature');
    await this.verifySignature(signature, holderResponse);

    if (holderResponse instanceof HolderAcceptance) {
      this.logger.log('holder accepted');
      this.logger.log('posting to Janusea');

      // this.clientService.sendAcceptance(holderResponse);
      await this.postToJanusea(holderResponse); // Error responses handled in here
    } else {
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
