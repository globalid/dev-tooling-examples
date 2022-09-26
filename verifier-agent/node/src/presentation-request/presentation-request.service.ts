import {
  createPresentationRequestUrl,
  GidVerifierClient,
  HolderAcceptance,
  HolderRejection,
  HolderResponse,
  VerifiablePresentation
} from '@globalid/verifier-toolkit';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ClientService } from './client/client.service';
import { InvalidSignatureError } from './invalid-signature.error';
import { PresentationRequirementsFactory } from './presentation-requirements.factory';
import { QrCodeViewModel } from './qr-code.view-model';
// import { ErrorInfoJanusea } from './client/error-event';

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

  setCredentialDataIdType(data: VerifiablePresentation): string {
    let idType;
    if (data['id_type'].includes('SSN')) {
      idType = 'SSN';
    } else if (data['id_type'].includes('ITIN')) {
      idType = 'ITIN';
    } else if (data['id_type'].includes('ATIN')) {
      idType = 'ATIN';
    } else {
      return undefined;
    }
    return idType;
  }

  parseCredentialData(holderResponse: HolderAcceptance): VerifiablePresentation {
    let data = holderResponse.proofPresentation.dif.verifiableCredential[0].credentialSubject;
    this.logger.log("Raw credential data from GlobaliD:")
    this.logger.log(data);
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
      return {'error': 'Invalid ID type'};
    }
    // Strip the dashes from the SSN, and also check if it's 9 digits
    data['id_number'] = data['id_number'].replaceAll('-', '');
    if (data['id_number'].length != 9) {
      this.logger.log("Invalid SSN length");
      this.logger.log(data['id_number']);
      this.clientService.sendInvalidIdType(holderResponse);
      return {'error': 'Invalid ID type'};
    }

    // Remove country code if it's a US phone number. If not a US phone number, tell the user
    if (data['phone_number'].includes('+1')) {
      const cur_number = data['phone_number'];
      data['phone_number'] = cur_number.substring(cur_number.length - 10);
      data['phone_number'] = data['phone_number'].substring(0, 3) + '-' + data['phone_number'].substring(3, 6) + '-' + data['phone_number'].substring(6, 10);
  } else {
    this.clientService.sendInvalidPhoneNumber(holderResponse);
    return {'error': 'Invalid phone number'};
  }

    // Update the address to only include 3 items
    let split_address = data['full_residence_address'].split(',');
    split_address.pop();
    data['full_residence_address'] = split_address.join(',');
    return data;
  }

  async postToJanusea(holderResponse: HolderAcceptance) {
    // Parse the data and re-name keys to match the Janusea API
    const data = this.parseCredentialData(holderResponse);
    if (data['error']) {
      // If there was an error parsing the credential data, we've already send the user to the error page and can return
      return;
    }
    this.logger.log("request data");
    this.logger.log(data);


    const config = {
      headers: {
        'X-HTTP-Method-Override': 'POST',
        'X-HTTP-FI-Code': 'testcore3',
      },
      timeout: 10000,
      }

    axios.post('https://eco.kivagroup.com/bonifii/membership', data, config).then(res => {
      // If we get a success response, we can accept the credential and send the user to the "account created" page
      this.logger.log('Account creation successful');
      // this.logger.log(res.data);

      // Set the account number so we can display it later
      holderResponse['loneStarAccountNumber'] = res.data['membershipId'];
      this.clientService.sendAcceptance(holderResponse);
    }).catch(err => {
      if (err.response){
        // Request was sent and server responded with non 2xx status code
        this.logger.log("Error creating account");
        this.logger.log(err.response.data);
        
        if(err.response.status == 500) {
          this.logger.log('Error calling Janusea API: 500 response code')
          this.clientService.sendSomethingWentWrong(holderResponse);
          return;
        }

        const message = err.response.data.error.message;

        // XML validation failing means bad input in the body of the request. Most likely 
      if(message == "TIN matches an existing SSN or ITIN or ATIN") {
          // TODO: How do we get the account number if it's already created? Can we query by SSN/ITIN?
          holderResponse['loneStarAccountNumber'] = '00000573910020';
          this.clientService.sendAlreadyCreatedMessage(holderResponse);
        } else {
          this.clientService.sendSomethingWentWrong(holderResponse);
          this.logger.log("Janusea API error: " + message);
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
      // this.logger.log('posting to Janusea');

      // // this.clientService.sendAcceptance(holderResponse);
      await this.postToJanusea(holderResponse); // Error responses handled in here
      this.clientService.sendAcceptance(holderResponse);
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
