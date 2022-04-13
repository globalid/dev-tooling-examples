export interface ProofRequestDto {
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
  format?: any;
  /**
   * A JSON LD Framing Document object.
   * @see https://w3c.github.io/json-ld-framing/
   */
  frame?: any;
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
  rule: 'all' | 'pick';
}

export interface InputDescriptor {
  constraints?: Constraints;
  id: string;
  name?: string;
  purpose?: string;
  format?: any;
  group?: string[];
}

export interface Constraints {
  fields?: Field[];
  limit_disclosure?: 'required' | 'preferred';
}

export interface Field {
  /**
   * A JSON Schema descriptor used to filter against the values returned from evaluation of the
   * JSONPath string expressions in the path array.
   */
  filter?: any;
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
