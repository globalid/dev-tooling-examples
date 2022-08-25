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
      name: 'Proof Requirements',
      purpose: 'To demonstrate creating the Presentation Requirements for a Presentation Request',
      id: 'c4272baf-1c96-4246-95e2-ed816f471793',
      format: {
        ldp_vp: {
          proof_type: [ProofAlgorithm.BbsBlsSignature2020]
        }
      },
      input_descriptors: [
        {
          id: 'government_id',
          name: 'Government ID',
          schema: {
            oneof_filter: [
              {
                required: true,
                uri: 'https://credentials.global.id/v1/schema-registry/contexts/Driving%20license/versions/1#Driving%20license'
              },
              {
                required: true,
                uri: 'https://credentials.global.id/v1/schema-registry/contexts/Passport/versions/2#Passport'
              }
            ]
          },
          constraints: {
            limit_disclosure: RequirementStatus.Required,
            is_holder: [
              {
                directive: 'required',
                field_id: [
                  'e45e83c8-bd3a-466d-bf54-db75967923ec',
                  '9bbb3fc2-7597-421a-92db-e7b6f881bf85',
                  '1f44d55f-f161-4938-a659-f8026467f126'
                ]
              }
            ],
            status_active: AllowanceStatus.Allowed,
            status_revoked: AllowanceStatus.Allowed,
            status_suspended: RequiredStatus.Allowed,
            subject_is_issuer: RequirementStatus.Preferred,
            fields: [
              {
                id: 'e45e83c8-bd3a-466d-bf54-db75967923ec',
                path: ['$.credentialSubject.last_name_legal']
              },
              {
                id: '9bbb3fc2-7597-421a-92db-e7b6f881bf85',
                path: ['$.credentialSubject.first_name_legal']
              },
              {
                id: '1f44d55f-f161-4938-a659-f8026467f126',
                path: ['$.credentialSubject.date_of_birth'],
                purpose: 'Holder must be over 18',
                filter: {
                  maximum: dayjs().subtract(18, 'years').format('YYYY-MM-DD'),
                  type: FilterValueType.String,
                  format: FilterValueFormat.Date
                }
              }
            ]
          }
        }
      ]
    };
  }
}
