import { Controller, Get, Render } from '@nestjs/common';

@Controller('results')
export class ResultsController {
  @Get()
  @Render('results')
  index() {
    return {
      results: {
        attestations: [
          {
            uuid: '123',
            tracking_id: 'string',
            type: 'personal',
            attestee: 'McDonalds',
            attestee_uuid: '123',
            attestor: 'Me',
            related_attestations: '',
            data_hash: '',
            attestor_signed_at: '',
            attestee_signed_at: '',
            attestor_signature: '',
            attestee_signature: '',
            sig_version: 2,
            public_data: '',
            public_attestor_note: 'string',
            app_uuid: 'string'
          },
          {
            uuid: '234',
            tracking_id: 'string',
            type: 'personal',
            attestee: 'Twitter',
            attestee_uuid: '234',
            attestor: 'Me',
            related_attestations: '',
            data_hash: '',
            attestor_signed_at: '',
            attestee_signed_at: '',
            attestor_signature: '',
            attestee_signature: '',
            sig_version: 2,
            public_data: '',
            public_attestor_note: 'string',
            app_uuid: 'string'
          }
        ]
      }
    };
  }
}

// export interface Attestation {

// }
