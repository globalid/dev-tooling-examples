import { PresentationRequirementsFactory } from '../presentationRequest/presentation-requirements-factory';
import { CreateProofRequestDto } from './create-proof-request-dto';

export class CreateProofRequestDtoFactory {
  constructor(private readonly presentationRequirementsFactory: PresentationRequirementsFactory) {}
  create(trackingId: string, webhookUrl: string): CreateProofRequestDto {
    return (<CreateProofRequestDto>{
      proof_requirements: this.presentationRequirementsFactory.create(),
      screening_webhook_url: webhookUrl,
      tracking_id: trackingId
    }) as CreateProofRequestDto;
  }
}
