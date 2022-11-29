import { PresentationRequirements } from '@globalid/verifier-toolkit';
import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class PresentationRequirementsFactory {
  abstract list(): PresentationRequirements[];

  abstract create(name: string): PresentationRequirements;
}

export interface PresentationRequirementsProvider {
  name: string;
  provide(): PresentationRequirements;
}
