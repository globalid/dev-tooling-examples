import {
  PresentationRequirements,
  PresRequestFormat,
  RequestPresentationAttach
} from './create-presentation-request-dto';

/**
 * Used by `EpamClient`
 */
export interface CreateProofRequestDto {
  proof_requirements: PresentationRequirements;
  screening_webhook_url: string;
  tracking_id: string;
}

export interface ProofRequestResponseDto {
  '@type'?: string;
  '@id': string;
  will_confirm?: boolean;
  'request_presentations~attach': RequestPresentationAttach[];
  comment?: string;
  formats: PresRequestFormat[];
}
