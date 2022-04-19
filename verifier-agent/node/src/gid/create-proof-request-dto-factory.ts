import {
  AllowanceStatus,
  CreateProofRequestDto,
  FilterValueType,
  FilterValueTypeDate,
  ProofAlgorithm,
  ProofRequirements,
  RequiredStatus,
  RequirementStatus
} from './create-proof-request-dto';

export class CreateProofRequestDtoFactory {
  buildCreateProofRequestDto = (trackingId: string, webhookUrl: string) => {
    return {
      proof_requirements: this.createProofRequirements(),
      screening_webhook_url: webhookUrl,
      tracking_id: trackingId
    } as CreateProofRequestDto;
  };

  createProofRequirements = (): ProofRequirements => ({
    name: 'Proof Requirements',
    purpose: 'To demonstrate creating the Proof Requirements for a Proof Request',
    id: 'c4272baf-1c96-4246-95e2-ed816f471793',
    format: { ldp_vp: { proof_type: [ProofAlgorithm.BbsBlsSignature2020] } },
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
          limit_disclosure: RequirementStatus.required,
          is_holder: [
            {
              directive: 'required',
              field_id: ['1f44d55f-f161-4938-a659-f8026467f126']
            }
          ],
          status_active: AllowanceStatus.allowed,
          status_revoked: AllowanceStatus.allowed,
          status_suspended: RequiredStatus.allowed,
          subject_is_issuer: RequirementStatus.preferred,
          fields: [
            {
              id: '1f44d55f-f161-4938-a659-f8026467f126',
              path: ['$.credentialSubject.date_of_birth'],
              purpose: 'User must be over 18',
              filter: { maximum: '2004-04-17', type: FilterValueType.string, format: FilterValueTypeDate.date }
            },
            {
              id: 'aa835aa1-f62e-4c7f-a2a0-3f26b5773b10',
              path: ['$.credentialSubject.date_of_birth'],
              purpose: 'User must be under 21',
              filter: { minimum: '2001-04-19', type: FilterValueType.string, format: FilterValueTypeDate.date }
            },
            {
              id: '29cccc89-ad6d-4f55-990d-1a7b8ea6c67f',
              path: ['$.credentialSubject.issuer'],
              purpose: 'User must be under 21',
              filter: { const: 'did:key:<veriff did key>' }
            }
          ]
        }
      }
    ]
  });
}
