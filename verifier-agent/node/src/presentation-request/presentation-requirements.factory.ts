import {
  AllowanceStatus,
  PresentationRequirements,
  ProofAlgorithm,
  RequiredStatus,
  RequirementStatus
} from '@globalid/verifier-toolkit';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PresentationRequirementsFactory {
  create(): PresentationRequirements {
    return {
      name: 'Proof Requirements',
      purpose: 'To demonstrate creating the Presentation Requirements for a Presentation Request with prerequisites',
      id: '0748bed6-ffb3-4f68-a3e2-fd4362b63c24',
      format: {
        ldp_vp: {
          proof_type: [ProofAlgorithm.BbsBlsSignature2020]
        }
      },
      input_descriptors: [
        {
          id: 'phone_number',
          name: 'Phone Number',
          schema: [
            {
              required: true,
              uri: 'https://credentials.global.id/v1/schema-registry/contexts/Phone%20number/versions/1'
            }
          ],
          constraints: {
            limit_disclosure: RequirementStatus.Required,
            is_holder: [
              {
                directive: 'required',
                field_id: ['ff6844b1-5597-4de6-9910-df64721a0519']
              }
            ],
            status_active: AllowanceStatus.Allowed,
            status_revoked: AllowanceStatus.Disallowed,
            status_suspended: RequiredStatus.Disallowed,
            subject_is_issuer: RequirementStatus.Preferred,
            fields: [
              {
                id: 'ff6844b1-5597-4de6-9910-df64721a0519',
                path: ['$.credentialSubject.phone_number'],
                purpose: 'Holder must have a valid phone number'
              }
            ]
          }
        },
        {
          id: 'email',
          name: 'Email',
          schema: [
            {
              required: true,
              uri: 'https://credentials.global.id/v1/schema-registry/contexts/Email/versions/1'
            }
          ],
          constraints: {
            limit_disclosure: RequirementStatus.Required,
            is_holder: [
              {
                directive: 'required',
                field_id: ['b48fabf6-9e99-48a5-9a89-bd58c7b7e9b3']
              }
            ],
            status_active: AllowanceStatus.Allowed,
            status_revoked: AllowanceStatus.Disallowed,
            status_suspended: RequiredStatus.Disallowed,
            subject_is_issuer: RequirementStatus.Preferred,
            fields: [
              {
                id: 'b48fabf6-9e99-48a5-9a89-bd58c7b7e9b3',
                path: ['$.credentialSubject.email'],
                purpose: 'Holder must have an email address'
              }
            ]
          }
        },
        {
          id: 'self_declared_id',
          name: 'Self Declared ID',
          schema: [
            {
              required: true,
              uri: 'https://credentials.global.id/v1/schema-registry/contexts/Identity%20Declaration/versions/1'
            }
          ],
          constraints: {
            limit_disclosure: RequirementStatus.Required,
            is_holder: [
              {
                directive: 'required',
                field_id: ['86801c4d-0e4e-4811-9af3-c72b5cd75219']
              },
              {
                directive: 'required',
                field_id: ['df950bbe-5855-44b8-8bfb-395ca792890c']
              },
              {
                directive: 'required',
                field_id: ['421f1366-335d-43fc-bfa4-c6bc6455be05']
              },
              {
                directive: 'required',
                field_id: ['6a55adab-e941-4e32-8324-3c03c0a11902']
              },
              {
                directive: 'required',
                field_id: ['275536cf-f104-4430-b53a-c7af5cf76108']
              }
            ],
            status_active: AllowanceStatus.Allowed,
            status_revoked: AllowanceStatus.Disallowed,
            status_suspended: RequiredStatus.Disallowed,
            subject_is_issuer: RequirementStatus.Preferred,
            fields: [
              {
                id: '86801c4d-0e4e-4811-9af3-c72b5cd75219',
                path: ['$.credentialSubject.address_full'],
                purpose: 'The full address of the credential holder'
              },
              {
                id: 'df950bbe-5855-44b8-8bfb-395ca792890c',
                path: ['$.credentialSubject.ip_address'],
                purpose: 'The ip address of the credential holder'
              },
              {
                id: '421f1366-335d-43fc-bfa4-c6bc6455be05',
                path: ['$.credentialSubject.address_country'],
                purpose: 'The Country of residence of the credential holder'
              },
              {
                id: '6a55adab-e941-4e32-8324-3c03c0a11902',
                path: ['$.credentialSubject.date_of_birth'],
                purpose: 'The date of birth of the credential holder'
              },
              {
                id: '275536cf-f104-4430-b53a-c7af5cf76108',
                path: ['$.credentialSubject.full_name_legal'],
                purpose: 'The full legal name of the credential holder'
              }
            ]
          }
        }
      ]
    };
  }
}
