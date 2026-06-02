import type { FieldType } from '../../../shared/constants/form';
import type { FieldValidationRule, VisibilityRule } from './rules';

export interface FieldOption {
  label: string;
  value: string;
}

interface FieldBase {
  id: string;
  label: string;
  type: FieldType;
  order?: number;
  required?: boolean;
  defaultValue?: unknown;
  placeholder?: string;
  helperText?: string;
  visibility?: VisibilityRule;
  validation?: FieldValidationRule[];
}

export interface TextFieldSchema extends FieldBase {
  type: 'text';
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  maxLength?: number;
}

export interface RadioFieldSchema extends FieldBase {
  type: 'radio';
  options: FieldOption[];
}

export interface CheckboxFieldSchema extends FieldBase {
  type: 'checkbox';
  options: FieldOption[];
}

export interface FileFieldSchema extends FieldBase {
  type: 'file';
  allowedMimeTypes?: string[];
  maxFileSizeBytes?: number;
}

export interface ImageFieldSchema extends FieldBase {
  type: 'image';
  allowCamera?: boolean;
  allowGallery?: boolean;
  maxFileSizeBytes?: number;
}

export type FieldSchema =
  | TextFieldSchema
  | RadioFieldSchema
  | CheckboxFieldSchema
  | FileFieldSchema
  | ImageFieldSchema;
