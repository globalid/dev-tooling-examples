import { UnknownRecord } from '../interfaces';

export interface CreateProofRequestDto {
  presentationRequirements: PresentationRequirements;
  trackingId: string;
  webhookUrl: string;
}

export interface PresentationRequirements {
  comment: string;
  presentation_definition: PresentationDefinition;
}

/**
 * @see https://identity.foundation/presentation-exchange/#presentation-definition
 */
export interface PresentationDefinition {
  /**
   * An object with one or more properties matching the registered Claim Format Designations. (e.g., jwt, jwt_vc, jwt_vp, etc.)
   * Specifies which Claim Formats the Verifier can process.
   * @see https://identity.foundation/presentation-exchange/#claim-format-designations
   */
  format?: UnknownRecord;
  /**
   * A JSON LD Framing Document object.
   * @see https://w3c.github.io/json-ld-framing/
   */
  frame?: UnknownRecord;
  id: string;
  input_descriptors: InputDescriptor[];
  name?: string;
  purpose?: string;
  submission_requirements: SubmissionRequirement[];
}

export interface SubmissionRequirement {
  /**
   * If `rule` is "pick," the minimum number of met requirements in the group `from`.
   */
  count?: number;
  /**
   * If `rule` is "pick," which `group` to require from.
   */
  from?: string;

  from_nested?: SubmissionRequirement[];

  min?: number;
  max?: number;
  /**
   * A descriptive name.
   */
  name?: string;
  /**
   * Purpose of this requirement.
   */
  purpose?: string;
  /**
   * If "pick," at least `count` requirements must be met.
   */
  rule: SubmissionRequirementRule;
}

export interface InputDescriptor {
  /**
   * Field constraints and disclosure setting
   */
  constraints?: InputDescriptorConstraints;
  /**
   * An object with one or more properties matching the registered Claim Format Designations (e.g., jwt, jwt_vc, jwt_vp, etc.).
   * Specifies which Claim Formats the Verifier can process.
   *
   * This format property is identical in value signature to the top-level format object,
   * but can be used to specifically constrain submission of a single input to a subset of formats or algorithms.
   * @see https://identity.foundation/presentation-exchange/#claim-format-designations
   */
  format?: UnknownRecord;

  /**
   * Array of group names used by `SubmissionRequirement` to pick some number of requirements, if `rule` = "pick"
   */
  group?: string[];

  id: string;
  /**
   * A descriptive name.
   */
  name?: string;
  /**
   * Purpose of this descriptor.
   */
  purpose?: string;
}

export interface InputDescriptorConstraints {
  fields?: Field[];
  limit_disclosure?: LimitDisclosureSetting;
}

export interface Field {
  /**
   * A JSON Schema descriptor used to filter against the values returned from evaluation of the
   * JSONPath string expressions in the path array.
   */
  filter?: UnknownRecord;
  /**
   * A string that is unique from every other field object’s id property, including those contained in
   * other Input Descriptor Objects.
   */
  id?: string;
  /**
   * An array of one or more JSONPath string expressions that select a target value from the input.
   *
   * @see https://identity.foundation/presentation-exchange/#jsonpath-syntax-definition
   */
  path: string[];
  /**
   * A string that describes the purpose for which the field is being requested.
   */
  purpose?: string;
}

export type SubmissionRequirementRule = 'all' | 'pick';

export type LimitDisclosureSetting = 'preferred' | 'required';
