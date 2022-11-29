import { PresentationRequirements } from '@globalid/verifier-toolkit';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PresentationRequirementsFactory, PresentationRequirementsProvider } from './presentation-requirements.factory';
import ProofRequirements from '../presentation-requirements/proof-requirements';

@Injectable()
export class InMemoryPresentationRequirementsFactory implements PresentationRequirementsFactory {
  private readonly requirementProviders: PresentationRequirementsProvider[] = [new ProofRequirements()];

  list(): PresentationRequirements[] {
    return this.requirementProviders.map((requirementProvider) => requirementProvider.provide());
  }

  create(name: string): PresentationRequirements {
    const requirementProvider = this.requirementProviders.find((r) => r.name === name);

    if (!requirementProvider) throw new NotFoundException({ message: `Requirement ${name} does not exist` });

    return requirementProvider.provide();
  }
}
