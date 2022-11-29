import { Injectable, NotFoundException } from '@nestjs/common';
import { PresentationRequirementsFactory } from './presentation-requirements.factory';
import { JsonPresentationRequirementsFactory } from './json-presentation-requirements.factory';
import { InMemoryPresentationRequirementsFactory } from './in-memory-presentation-requirements.factory';
import { PresentationRequirements } from '@globalid/verifier-toolkit';

@Injectable()
export class AggregatePresentationRequirementsFactory implements PresentationRequirementsFactory {
  private factories: PresentationRequirementsFactory[];

  constructor(
    private jsonFactory: JsonPresentationRequirementsFactory,
    private inMemoryFactory: InMemoryPresentationRequirementsFactory
  ) {
    this.factories = [inMemoryFactory, jsonFactory];
  }

  create(name: string): PresentationRequirements {
    for (let i = 0; i < this.factories.length; i++) {
      try {
        return this.factories[i].create(name);
        // eslint-disable-next-line no-empty
      } catch (e) {}
    }

    throw new NotFoundException({ message: `Requirement ${name} does not exist` });
  }

  list(): PresentationRequirements[] {
    return this.factories.flatMap((factory) => factory.list());
  }
}
