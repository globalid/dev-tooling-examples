import * as dayjs from 'dayjs';

import {
  AllowanceStatus,
  FilterValueFormat,
  FilterValueType,
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
      name: 'Bonifii Proof Requirements',
      purpose: 'To demonstrate creating the Presentation Requirements for a Presentation Request',
      id: 'c59db1dd-4ed5-4668-b337-87241d484840',
      format: {
        ldp_vp: {
          proof_type: [ProofAlgorithm.BbsBlsSignature2020]
        }
      },
      input_descriptors: [
        {
          id: 'bonifii-bronze',
          name: 'Bonifii bronze',
          schema: {
            oneof_filter: [
              {
                required: true,
                //uri: 'https://credentials.global.id/v1/schema-registry/contexts/Bonifii%20bronze/versions/4#Bonifii%20bronze'
                uri: 'https://credentials.global.id/v1/schema-registry/contexts/Bonifii%20Bronze/versions/2#Bonifii%20Bronze'
              }
            ]
          },
          constraints: {
            limit_disclosure: RequirementStatus.Required,
            is_holder: [
              {
                directive: 'required',
                field_id: ['632f94f3-e9d5-4992-9576-0856ff503e4f']
              }
            ],
            status_active: AllowanceStatus.Allowed,
            status_revoked: AllowanceStatus.Allowed,
            status_suspended: RequiredStatus.Allowed,
            subject_is_issuer: RequirementStatus.Preferred,
            fields: [
              {
                id: '632f94f3-e9d5-4992-9576-0856ff503e4f',
                path: ['$.credentialSubject.full_name_legal'],
                purpose: 'Holder must have valid date of birth',
              },
              {
                id: '632f94f3-e9d5-4992-9576-0856ff503e4f',
                path: ['$.credentialSubject.date_of_birth'],
                purpose: 'Holder must have valid date of birth',
              },
              {
                id: '632f94f3-e9d5-4992-9576-0856ff503e4f',
                path: ['$.credentialSubject.email'],
                purpose: 'Holder must have valid date of birth',
              },
              {
                id: '632f94f3-e9d5-4992-9576-0856ff503e4f',
                path: ['$.credentialSubject.email_verification_date'],
                purpose: 'Holder must have valid date of birth',
              },
              {
                id: '632f94f3-e9d5-4992-9576-0856ff503e4f',
                path: ['$.credentialSubject.phone_number'],
                purpose: 'Holder must have valid date of birth',
              },
              {
                id: '632f94f3-e9d5-4992-9576-0856ff503e4f',
                path: ['$.credentialSubject.phone_number_verification_date'],
                purpose: 'Holder must have valid date of birth',
              },
              {
                id: '632f94f3-e9d5-4992-9576-0856ff503e4f',
                path: ['$.credentialSubject.address_full'],
                purpose: 'Holder must have valid address',
              },
              {
                id: '632f94f3-e9d5-4992-9576-0856ff503e4f',
                path: ['$.credentialSubject.ip_address'],
                purpose: 'Holder must have valid date of birth',
              },
              {
                id: '632f94f3-e9d5-4992-9576-0856ff503e4f',
                path: ['$.credentialSubject.id_type'],
                purpose: 'Holder must have valid date of birth',
              },
              {
                id: '632f94f3-e9d5-4992-9576-0856ff503e4f',
                path: ['$.credentialSubject.id_number'],
                purpose: 'Holder must have valid date of birth',
              }
            ]
          }
        }
      ]
    };
  }
}
