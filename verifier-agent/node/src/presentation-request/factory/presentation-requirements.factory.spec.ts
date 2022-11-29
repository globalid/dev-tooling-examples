import { InMemoryPresentationRequirementsFactory } from './in-memory-presentation-requirements.factory';
import { JsonPresentationRequirementsFactory } from './json-presentation-requirements.factory';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { mockConfigService } from '../../../test/common';
import { PresentationRequirementsFactory } from './presentation-requirements.factory';
import { TestingModuleBuilder } from '@nestjs/testing/testing-module.builder';
import { AggregatePresentationRequirementsFactory } from './aggregate-presentation-requirements.factory';
import { NotFoundException } from '@nestjs/common';
import * as dayjs from 'dayjs';

interface PresentationRequirementsFactorySpec {
  name: string;
  module: TestingModuleBuilder;
}

const factorySpecs: PresentationRequirementsFactorySpec[] = [
  {
    name: 'in memory',
    module: Test.createTestingModule({
      providers: [
        {
          provide: PresentationRequirementsFactory,
          useClass: InMemoryPresentationRequirementsFactory
        }
      ]
    })
  },
  {
    name: 'json',
    module: Test.createTestingModule({
      providers: [
        ConfigService,
        { provide: PresentationRequirementsFactory, useClass: JsonPresentationRequirementsFactory }
      ]
    })
      .overrideProvider(ConfigService)
      .useValue(mockConfigService({ PRESENTATION_REQUIREMENTS_PATH: 'test/presentation-requirements' }))
  },
  {
    name: 'aggregate',
    module: Test.createTestingModule({
      providers: [
        ConfigService,
        JsonPresentationRequirementsFactory,
        InMemoryPresentationRequirementsFactory,
        { provide: PresentationRequirementsFactory, useClass: AggregatePresentationRequirementsFactory }
      ]
    })
      .overrideProvider(ConfigService)
      .useValue(mockConfigService({ PRESENTATION_REQUIREMENTS_PATH: 'test/presentation-requirements' }))
  }
];

// eslint-disable-next-line jest/valid-describe-callback
describe.each(factorySpecs)('Presentation requirements', (factorySpec) => {
  let factory: PresentationRequirementsFactory;

  beforeAll(async () => {
    const module = await factorySpec.module.compile();

    factory = module.get(PresentationRequirementsFactory);
  });

  describe(`${factorySpec.name} factory`, () => {
    it('lists available requirements', () => {
      const list = factory.list();

      expect(list.length).toBeGreaterThan(0);
      expect(list[0].name).toBe('Proof Requirements');
    });

    it('creates presentation requirements', () => {
      const presentationRequirements = factory.create('Proof Requirements');

      expect(presentationRequirements.name).toBe('Proof Requirements');
    });

    it('has over 18 constraint', () => {
      const presentationRequirements = factory.create('Proof Requirements');

      expect(presentationRequirements.input_descriptors[0].constraints.fields[0].filter.maximum).toEqual(
        dayjs().subtract(18, 'years').format('YYYY-MM-DD')
      );
    });

    it('fails if presentation requirements do not exist', () => {
      expect(() => factory.create('I do not exist')).toThrow(NotFoundException);
    });
  });
});
