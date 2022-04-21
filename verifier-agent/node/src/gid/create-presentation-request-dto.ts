import { ProofRequirements } from './create-proof-request-dto';

/**
 * Used by `GidVerifierClient`
 */
export interface CreatePresentationRequestDto {
  presentationRequirements: PresentationRequirements;
  webhookUrl: string;
  trackingId: string;
}

export type PresentationRequirements = ProofRequirements;
