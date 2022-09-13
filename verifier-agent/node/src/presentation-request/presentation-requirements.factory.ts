/**************************************
 * Class for creating the JSON object required for the presentation request.
 * This is where you declare what credentials schema and PII you'd like to retreive.
 * You can also set requireents on the value of the PII being retrieved by using a filter.
 **************************************/

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
      name: 'Bonifii Bronze Credential',
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
          name: 'Bonifii Bronze',
          schema: {
            oneof_filter: [
              {
                required: true,
                uri: 'https://credentials.global.id/v1/schema-registry/contexts/Bonifii%20Bronze/versions/3#Bonifii%20Bronze'
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
                path: ['$.credentialSubject.globalid_id'],
                purpose: 'Holder\'s GlobaliD',
              },
              {
                id: '632f94f3-e9d5-4992-9576-0856ff503e4f',
                path: ['$.credentialSubject.full_name_legal'],
                purpose: 'Holder\'s legal name',
              },
              {
                id: '632f94f3-e9d5-4992-9576-0856ff503e4f',
                path: ['$.credentialSubject.date_of_birth'],
                purpose: 'Holder must have valid date of birth',
              },
              {
                id: '632f94f3-e9d5-4992-9576-0856ff503e4f',
                path: ['$.credentialSubject.email'],
                purpose: 'Holder must have valid email',
              },
              {
                id: '632f94f3-e9d5-4992-9576-0856ff503e4f',
                path: ['$.credentialSubject.email_verification_date'],
                purpose: 'Email verification date',
              },
              {
                id: '632f94f3-e9d5-4992-9576-0856ff503e4f',
                path: ['$.credentialSubject.phone_number'],
                purpose: 'Holder must have valid phone number',
              },
              {
                id: '632f94f3-e9d5-4992-9576-0856ff503e4f',
                path: ['$.credentialSubject.phone_number_verification_date'],
                purpose: 'Phone number verification date',
              },
              {
                id: '632f94f3-e9d5-4992-9576-0856ff503e4f',
                path: ['$.credentialSubject.address_full'],
                purpose: 'Holder must have valid address',
              },
              {
                id: '632f94f3-e9d5-4992-9576-0856ff503e4f',
                path: ['$.credentialSubject.ip_address'],
                purpose: 'IP address of device',
              },
              {
                id: '632f94f3-e9d5-4992-9576-0856ff503e4f',
                path: ['$.credentialSubject.id_type'],
                purpose: 'Tax ID type (SSN, FRA ITN, etc.)',
              },
              {
                id: '632f94f3-e9d5-4992-9576-0856ff503e4f',
                path: ['$.credentialSubject.id_number'],
                purpose: 'Holder must have valid tax ID number',
              },
              {
                id: '632f94f3-e9d5-4992-9576-0856ff503e4f',
                path: ['$.credentialSubject.credential_date_of_issue'],
                purpose: 'Credential issuance date',
              },
              {
                id: '632f94f3-e9d5-4992-9576-0856ff503e4f',
                path: ['$.credentialSubject.credential_id'],
                purpose: 'Credential ID',
              }
            ]
          }
        }
      ]
    };
  }
}
