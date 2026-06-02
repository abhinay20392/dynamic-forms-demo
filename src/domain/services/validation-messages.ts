import type { FieldSchema } from '../entities/schema/fields';
import type { StaticValidationRule } from '../entities/schema/rules';

export function defaultValidationMessage(
  field: FieldSchema,
  rule: StaticValidationRule,
): string {
  switch (rule.type) {
    case 'required':
      return `${field.label} is required`;
    case 'minLength':
      return `${field.label} must be at least ${rule.value} characters`;
    case 'maxLength':
      return `${field.label} must be at most ${rule.value} characters`;
    case 'pattern':
      return `${field.label} format is invalid`;
    case 'minSelections':
      return `Select at least ${rule.value} option(s)`;
    case 'maxSelections':
      return `Select at most ${rule.value} option(s)`;
    case 'allowedMimeTypes':
      return `${field.label} file type is not allowed`;
    case 'maxFileSizeBytes':
      return `${field.label} exceeds maximum file size`;
    default:
      return `${field.label} is invalid`;
  }
}

export const DEFAULT_SECTION_VALIDATION_MESSAGE =
  'This section does not meet the required conditions';
