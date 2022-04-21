import { PresentationRequirementsFactory } from './presentation-requirements.factory';
import { CreatePresentationRequestDto } from '../gid/create-presentation-request-dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CreatePresentationRequestDtoFactory {
  constructor(private readonly presentationRequirementsFactory: PresentationRequirementsFactory) {}
  create(trackingId: string, webhookUrl: string): CreatePresentationRequestDto {
    return {
      presentationRequirements: this.presentationRequirementsFactory.create(),
      webhookUrl,
      trackingId
    };
  }
}
