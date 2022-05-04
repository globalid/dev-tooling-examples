import { PresentationRequirementsFactory } from './presentation-requirements.factory';
import { Injectable } from '@nestjs/common';
import { CreatePresentationRequestDto } from '@globalid/verifier-toolkit';

@Injectable()
export class CreatePresentationRequestDtoFactory {
  constructor(private readonly presentationRequirementsFactory: PresentationRequirementsFactory) {}
  create(trackingId: string, webhookUrl: string): CreatePresentationRequestDto {
    return {
      presentationRequirements: this.presentationRequirementsFactory.create(),
      trackingId,
      webhookUrl
    };
  }
}
