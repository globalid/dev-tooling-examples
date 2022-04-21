import { PresentationRequirementsFactory } from '../presentationRequest/presentation-requirements-factory';
import { CreatePresentationRequestDto } from './create-presentation-request-dto';

export class CreatePresentationRequestDtoFactory {
  constructor(private readonly presentationRequirementsFactory: PresentationRequirementsFactory) {}
  create(trackingId: string, webhookUrl: string) {
    return <CreatePresentationRequestDto>{
      presentationRequirements: this.presentationRequirementsFactory.create(),
      webhookUrl: webhookUrl,
      trackingId: trackingId
    };
  }
}
