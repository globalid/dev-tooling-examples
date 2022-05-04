import { plainToInstance } from 'class-transformer';
import * as crypto from 'crypto';
import { join } from 'path';
import { TrackingId } from 'src/types';

import { UserAcceptance, UserRejection, UserResponseState } from '@globalid/verifier-toolkit';
import { ProofRequestResponseDto } from '@globalid/verifier-toolkit/dist/presentation-request/create-proof-request-dto';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WsAdapter } from '@nestjs/platform-ws';
import { Test } from '@nestjs/testing';

export const createNestApp = async (imports: any[]): Promise<INestApplication> => {
  const moduleFixture = await Test.createTestingModule({
    imports: [...imports]
  })
    .overrideProvider(ConfigService)
    .useValue(
      mockConfigService({
        BASE_URL: 'http://localhost:8080',
        GID_CREDENTIALS_BASE_URL: 'https://credentials.globalid.dev',
        GID_API_BASE_URL: 'https://api.globalid.dev',
        CLIENT_ID: 'abcdef',
        CLIENT_SECRET: '123456',
        INITIATION_URL: 'https://www.example.com',
        REDIRECT_URL: 'https://www.example1.com'
      })
    )
    .compile();

  const app: any = moduleFixture.createNestApplication();
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  app.useWebSocketAdapter(new WsAdapter(app));
  return app;
};

export const webSocketUrl = 'ws://localhost:8080';

export const exampleUrl = 'https://example.com/';

export const trackingId: TrackingId = 'd0078bfe-7e42-4574-867a-ea3deeb0dbe2';

/**
 * Mock values returned by `ConfigService.get`
 *
 * @param env Key-Value pairs where Key is used to `get` a value from `ConfigService`
 */
export function mockConfigService(env: Record<string, any>) {
  return {
    get: jest.fn((key: string) => env[key])
  };
}

export const clientId = '13275c09-4c4c-4369-982b-28d5a679cb36';
export const clientSecret = '48688c67c6ee444348688c67c6ee4443';

export const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem'
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem'
  }
});

export const userResponse = {
  app_uuid: crypto.randomUUID(),
  tracking_id: trackingId,
  thread_id: crypto.randomUUID(),
  state: UserResponseState.Done,
  verified: true
};

export const userAcceptance: UserAcceptance = plainToInstance(UserAcceptance, {
  ...userResponse,
  proof_presentation: { something: 'or other' }
});

export const userRejection: UserRejection = plainToInstance(UserRejection, {
  ...userResponse,
  error_msg: 'uh oh!'
});

export const xSignature = {
  'X-Signature': 'signature'
};

export const createProofRequestAxiosResponse = {
  data: <ProofRequestResponseDto>{
    '@type': 'https://didcomm.org/present-proof/2.0/request-presentation',
    '@id': '78d1b09d-a7f2-4523-b125-92509480ba10',
    will_confirm: true,
    'request_presentations~attach': [
      {
        '@id': 'dif',
        'mime-type': 'application/json',
        data: {
          json: {
            options: {
              challenge: '053e465d-f1c2-4643-932f-3eda0087b6b2',
              domain: 'e0f0fe40-fb3d-42f4-9e39-4c5eac06b4b6'
            },
            presentation_definition: {
              name: 'Proof Requirements',
              purpose: 'To demonstrate creating the Proof Requirements for a Proof Request',
              id: 'c4272baf-1c96-4246-95e2-ed816f471793',
              format: {
                ldp_vp: {
                  proof_type: ['BbsBlsSignature2020']
                }
              },
              input_descriptors: [
                {
                  id: 'government_id',
                  name: 'Government ID',
                  metadata: {},
                  schema: {
                    oneof_filter: [
                      {
                        required: true,
                        uri: 'https://ssi.globalid.dev/v1/schema-registry/contexts/Driving%20license/versions/2#Driving%20license'
                      },
                      {
                        required: true,
                        uri: 'https://ssi.globalid.dev/v1/schema-registry/contexts/Passport/versions/2#Passport'
                      }
                    ]
                  },
                  constraints: {
                    limit_disclosure: 'required',
                    is_holder: [
                      {
                        directive: 'required',
                        field_id: ['1f44d55f-f161-4938-a659-f8026467f126']
                      }
                    ],
                    status_active: 'allowed',
                    status_revoked: 'allowed',
                    status_suspended: 'allowed',
                    subject_is_issuer: 'preferred',
                    fields: [
                      {
                        id: '1f44d55f-f161-4938-a659-f8026467f126',
                        path: ['$.credentialSubject.date_of_birth'],
                        purpose: 'User must be over 18',
                        filter: {
                          maximum: '2004-04-17',
                          type: 'string',
                          format: 'date'
                        }
                      },
                      {
                        id: 'aa835aa1-f62e-4c7f-a2a0-3f26b5773b10',
                        path: ['$.credentialSubject.date_of_birth'],
                        purpose: 'User must be under 21',
                        filter: {
                          minimum: '2001-04-19',
                          type: 'string',
                          format: 'date'
                        }
                      },
                      {
                        id: '29cccc89-ad6d-4f55-990d-1a7b8ea6c67f',
                        path: ['$.credentialSubject.issuer'],
                        purpose: 'Issuer must be <veriff did key>',
                        filter: {
                          const: 'did:key:<veriff did key>'
                        }
                      }
                    ]
                  }
                }
              ]
            }
          }
        }
      }
    ],
    formats: [
      {
        attach_id: 'dif',
        format: 'dif/presentation-exchange/definitions@v1.0'
      }
    ]
  }
};
