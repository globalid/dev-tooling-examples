import { Injectable } from '@nestjs/common';
import { PresentationRequirementsFactory } from './presentation-requirements.factory';

@Injectable()
export class PresentationRequestService {
  constructor(private readonly presentationRequirementsFactory: PresentationRequirementsFactory) {}
}
