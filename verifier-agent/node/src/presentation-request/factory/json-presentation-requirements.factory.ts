import { PresentationRequirementsFactory } from './presentation-requirements.factory';
import { InputDescriptor, PresentationRequirements } from '@globalid/verifier-toolkit';
import * as fs from 'fs';
import { Injectable, NotFoundException } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { ConfigService } from '@nestjs/config';

const filters = {
  over18: () => dayjs().subtract(18, 'years').format('YYYY-MM-DD')
};

class JsonPresentationRequirementsProvider {
  public name: string;
  private presentationRequirementsJson: string;

  constructor(private path: string) {
    this.presentationRequirementsJson = fs.readFileSync(this.path).toString();
    this.name = this.parseRequirements().name;
  }

  provide(): PresentationRequirements {
    const presentationRequirements = this.parseRequirements();
    presentationRequirements.input_descriptors = this.replaceDynamicFilters(presentationRequirements.input_descriptors);

    return presentationRequirements;
  }

  private parseRequirements(): PresentationRequirements {
    return JSON.parse(this.presentationRequirementsJson);
  }

  private replaceDynamicFilters(inputDescriptors: InputDescriptor[]): InputDescriptor[] {
    return inputDescriptors.map((inputDescriptor) => {
      if (inputDescriptor.constraints.fields) {
        inputDescriptor.constraints.fields = inputDescriptor.constraints.fields.map((field) => {
          if (field.filter) {
            field.filter = Object.entries(field.filter)
              .map(([name, value]) => {
                if (this.isDynamicFilter(value)) {
                  return [name, filters[value.substring(1)]()];
                } else {
                  return [name, value];
                }
              })
              .reduce((acc, [name, value]) => {
                acc[name] = value;
                return acc;
              }, {});
          }

          return field;
        });
      }

      return inputDescriptor;
    });
  }

  private isDynamicFilter(value: unknown) {
    return typeof value === 'string' && value.startsWith('#') && value.substring(1) in filters;
  }
}

@Injectable()
export class JsonPresentationRequirementsFactory implements PresentationRequirementsFactory {
  private readonly requirementProviders: JsonPresentationRequirementsProvider[];

  constructor(config: ConfigService) {
    const presentationRequestPath = config.get('PRESENTATION_REQUIREMENTS_PATH');
    const files = fs.readdirSync(presentationRequestPath, { withFileTypes: true });
    this.requirementProviders = files
      .filter((file) => file.isFile())
      .filter((file) => file.name.endsWith('json'))
      .map((file) => new JsonPresentationRequirementsProvider(`${presentationRequestPath}/${file.name}`));
  }

  create(name: string): PresentationRequirements {
    const requirementsProvider = this.requirementProviders.find((r) => r.name === name);

    if (!requirementsProvider) throw new NotFoundException({ message: `Requirement ${name} does not exist` });

    return requirementsProvider.provide();
  }

  list(): PresentationRequirements[] {
    return this.requirementProviders.map((provider) => provider.provide());
  }
}
