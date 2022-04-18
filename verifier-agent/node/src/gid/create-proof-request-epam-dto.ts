import { UnknownRecord } from '../interfaces';

export interface CreateProofRequestEpamDto {
  /**
   * presentationRequirements
   */
  proof_requirements: Attributes;
  /**
   * trackingId
   */
  tracking_id: string;
  /**
   * webhookUrl
   */
  screening_webhook_url: string;
}

/**
 * PresentationDefinition
 */
export interface Attributes {
  name?: string;
  purpose?: string;
  id: string;
  format: Format;
  input_descriptors: InputDescriptors[];
}

export interface Format {
  ldp_vp?: ProofType;
  ldp_vc?: ProofType;
}

export interface ProofType {
  proof_type: ProofAlgorithm[];
}

export enum AllowanceStatus {
  allowed = 'allowed',
  disallowed = 'disallowed'
}

export enum RequiredStatus {
  allowed = 'allowed',
  disallowed = 'disallowed',
  required = 'required'
}

export enum RequirementStatus {
  required = 'required',
  preferred = 'preferred'
}

/**
 * InputDescriptor
 */
export interface InputDescriptors {
  constraints: InputDescriptorsConstraints;
  id: string;
  name: string;
  group?: string[];
  metadata?: UnknownRecord;
  schema: InputDescriptorsSchema | InputDescriptorsSchemaOneofFilter[];
}

export interface InputDescriptorsSchema {
  oneof_filter?: InputDescriptorsSchemaOneofFilter[];
}

export interface InputDescriptorsSchemaOneofFilter {
  required?: boolean;
  uri: string;
}

/**
 * InputDescriptorConstraints
 */
export interface InputDescriptorsConstraints {
  limit_disclosure: RequirementStatus;
  is_holder?: InputDescriptorsConstraintsIsHolder[];
  status_active?: AllowanceStatus;
  status_revoked?: AllowanceStatus;
  status_suspended?: RequiredStatus;
  subject_is_issuer?: RequirementStatus;
  fields: InputDescriptorsConstraintsFields[];
}

export interface InputDescriptorsConstraintsIsHolder {
  directive: string;
  field_id: string[];
}

export interface InputDescriptorsConstraintsFields {
  id?: string;
  path: string[];
  purpose?: string;
  filter?: InputDescriptorsConstraintsFilter;
}

export interface InputDescriptorsConstraintsFilter {
  maximum?: string | number;
  minimum?: string | number;
  type?: FilterValueType;
  format?: FilterValueTypeDate;
  const?: string | number;
  enum?: string[] | number[];
  exclusiveMaximum?: string | number;
  exclusiveMinimum?: string | number;
  maxLength?: number;
  mimLength?: number;
  not?: boolean;
  pattern?: string;
}

export enum FilterValueType {
  string = 'string',
  number = 'number'
}

export enum FilterValueTypeDate {
  date = 'date',
  date_time = 'date-time'
}

export enum ProofAlgorithm {
  BbsBlsSignature2020 = 'BbsBlsSignature2020'
}

export interface ProofRequestResponseDto {
  '@type'?: string;
  '@id': string;
  will_confirm?: boolean;
  'request_presentations~attach': RequestPresentationAttach[];
  comment?: string;
  formats: PresRequestFormat[];
}

export interface RequestPresentationAttach {
  '@id'?: string;
  mime_type?: string;
  data: PresRequestData;
}

export interface PresRequestData {
  json: PresRequestDataJson;
}

export interface PresRequestFormat {
  attach_id: string;
  format: string;
}

export interface PresRequestDataJson {
  options: Options;
  presentation_definition: Attributes;
}

export interface Options {
  challenge: string;
  domain: string;
}
