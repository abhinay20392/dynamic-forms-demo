export const FORM_SCHEMA_VERSION = '1.0.0';

export const HIDDEN_VALUE_POLICIES = ['clear', 'retain'] as const;
export type HiddenValuePolicy = (typeof HIDDEN_VALUE_POLICIES)[number];

export const FIELD_TYPES = [
  'text',
  'radio',
  'checkbox',
  'file',
  'image',
] as const;
export type FieldType = (typeof FIELD_TYPES)[number];

export const CONDITION_OPERATORS = [
  'equals',
  'notEquals',
  'in',
  'notIn',
  'contains',
  'greaterThan',
  'greaterThanOrEqual',
  'lessThan',
  'lessThanOrEqual',
  'isEmpty',
  'isNotEmpty',
] as const;
export type ConditionOperator = (typeof CONDITION_OPERATORS)[number];

export const VALIDATION_RULE_TYPES = [
  'required',
  'minLength',
  'maxLength',
  'pattern',
  'minSelections',
  'maxSelections',
  'allowedMimeTypes',
  'maxFileSizeBytes',
] as const;

export const ATTACHMENT_SOURCES = [
  'file-picker',
  'gallery',
  'camera',
] as const;
export type AttachmentSource = (typeof ATTACHMENT_SOURCES)[number];
