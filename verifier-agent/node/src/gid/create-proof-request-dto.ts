import { PresentationRequirements } from './create-presentation-request-dto';

/**
 * Used by `EpamClient`
 */
export interface CreateProofRequestDto {
  proof_requirements: PresentationRequirements;
  screening_webhook_url: string;
  tracking_id: string;
}
