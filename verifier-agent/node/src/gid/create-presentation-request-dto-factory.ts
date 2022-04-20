import { PresentationRequirementsFactory } from '../presentationRequest/presentation-requirements-factory';
import { CreatePresentationRequestDto } from './create-presentation-request-dto';

export class CreatePresentationRequestDtoFactory {
  constructor(private readonly presentationRequirementsFactory: PresentationRequirementsFactory) {}
  create(trackingId: string, webhookUrl: string): CreatePresentationRequestDto {
    return (<CreatePresentationRequestDto>{
      proof_requirements: this.presentationRequirementsFactory.create(),
      screening_webhook_url: webhookUrl,
      tracking_id: trackingId
    }) as CreatePresentationRequestDto;
  }
}
