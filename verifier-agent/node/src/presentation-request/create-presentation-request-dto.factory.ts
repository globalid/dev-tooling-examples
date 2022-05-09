import { CreatePresentationRequestDto } from '@globalid/verifier-toolkit';
import { Injectable } from '@nestjs/common';

import { PresentationRequirementsFactory } from './presentation-requirements.factory';

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
