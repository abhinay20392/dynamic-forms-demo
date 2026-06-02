import type { FieldSchema } from '../entities/schema/fields';
import type { SectionSchema } from '../entities/schema/sections';
import type { FormSchema } from '../entities/schema/form-schema';
import {
  type FieldValidationRule,
  isDynamicValidationRule,
  type StaticValidationRule,
} from '../entities/schema/rules';
import type {
  FieldValidationError,
  FormValidationResult,
  SectionValidationError,
} from '../entities/validation/validation-result';
import type { FieldValue, FormValues } from '../entities/submission/field-values';
import {
  asAttachment,
  asString,
  getSelectionCount,
  isEmptyValue,
} from '../utils/value-utils';
import type { IRuleEvaluator } from './rule-evaluator';
import {
  defaultValidationMessage,
  DEFAULT_SECTION_VALIDATION_MESSAGE,
} from './validation-messages';

export interface IValidationEngine {
  validate(schema: FormSchema, values: FormValues): FormValidationResult;
  validateField(
    field: FieldSchema,
    values: FormValues,
  ): FieldValidationError[];
  validateSection(
    section: SectionSchema,
    values: FormValues,
  ): SectionValidationError | null;
}

export class ValidationEngine implements IValidationEngine {
  constructor(private readonly ruleEvaluator: IRuleEvaluator) {}

  validate(schema: FormSchema, values: FormValues): FormValidationResult {
    const fieldErrors: FieldValidationError[] = [];
    const sectionErrors: SectionValidationError[] = [];

    for (const section of schema.sections) {
      const sectionError = this.validateSection(section, values);
      if (sectionError) {
        sectionErrors.push(sectionError);
      }
      for (const field of section.fields) {
        fieldErrors.push(...this.validateField(field, values));
      }
    }

    return {
      isValid: fieldErrors.length === 0 && sectionErrors.length === 0,
      fieldErrors,
      sectionErrors,
    };
  }

  validateSection(
    section: SectionSchema,
    values: FormValues,
  ): SectionValidationError | null {
    if (!section.validation) {
      return null;
    }
    const passes = this.ruleEvaluator.evaluate(section.validation, values);
    if (passes) {
      return null;
    }
    return {
      sectionId: section.id,
      message: DEFAULT_SECTION_VALIDATION_MESSAGE,
    };
  }

  validateField(
    field: FieldSchema,
    values: FormValues,
  ): FieldValidationError[] {
    const value = values[field.id];
    const errors: FieldValidationError[] = [];
    const rules = this.getApplicableRules(field);

    for (const rule of rules) {
      if (!this.shouldApplyRule(rule, values)) {
        continue;
      }
      const message = this.validateRule(field, rule, value);
      if (message) {
        errors.push({
          fieldId: field.id,
          message,
          ruleType: rule.type,
        });
      }
    }

    return errors;
  }

  private getApplicableRules(field: FieldSchema): FieldValidationRule[] {
    const rules: FieldValidationRule[] = [...(field.validation ?? [])];
    const hasExplicitRequired = rules.some(rule => rule.type === 'required');

    if (field.required && !hasExplicitRequired) {
      rules.unshift({ type: 'required' });
    }

    return rules;
  }

  private shouldApplyRule(
    rule: FieldValidationRule,
    values: FormValues,
  ): boolean {
    if (isDynamicValidationRule(rule)) {
      return this.ruleEvaluator.evaluate(rule.when, values);
    }
    return true;
  }

  private validateRule(
    field: FieldSchema,
    rule: StaticValidationRule,
    value: FieldValue | undefined,
  ): string | null {
    const message =
      rule.message ?? defaultValidationMessage(field, rule);

    switch (rule.type) {
      case 'required':
        return isEmptyValue(value) ? message : null;
      case 'minLength': {
        const min = Number(rule.value);
        if (Number.isNaN(min)) {
          return null;
        }
        return asString(value).length < min ? message : null;
      }
      case 'maxLength': {
        const max = Number(rule.value);
        if (Number.isNaN(max)) {
          return null;
        }
        return asString(value).length > max ? message : null;
      }
      case 'pattern': {
        const pattern = String(rule.value ?? '');
        if (!pattern) {
          return null;
        }
        try {
          const regex = new RegExp(pattern);
          return regex.test(asString(value)) ? null : message;
        } catch {
          return null;
        }
      }
      case 'minSelections': {
        const min = Number(rule.value);
        if (Number.isNaN(min)) {
          return null;
        }
        return getSelectionCount(value) < min ? message : null;
      }
      case 'maxSelections': {
        const max = Number(rule.value);
        if (Number.isNaN(max)) {
          return null;
        }
        return getSelectionCount(value) > max ? message : null;
      }
      case 'allowedMimeTypes': {
        const allowed = this.normalizeStringArray(rule.value);
        if (allowed.length === 0) {
          return null;
        }
        const attachment = asAttachment(value);
        if (!attachment) {
          return isEmptyValue(value) ? null : message;
        }
        return allowed.includes(attachment.mimeType) ? null : message;
      }
      case 'maxFileSizeBytes': {
        const maxBytes = Number(rule.value);
        if (Number.isNaN(maxBytes)) {
          return null;
        }
        const attachment = asAttachment(value);
        if (!attachment) {
          return null;
        }
        return attachment.sizeBytes > maxBytes ? message : null;
      }
      default:
        return null;
    }
  }

  private normalizeStringArray(value: unknown): string[] {
    if (Array.isArray(value)) {
      return value.filter((item): item is string => typeof item === 'string');
    }
    if (typeof value === 'string') {
      return [value];
    }
    return [];
  }
}

/** First error per field for UI display. */
export function mapFieldErrorsById(
  errors: FieldValidationError[],
): Record<string, string> {
  const map: Record<string, string> = {};
  for (const error of errors) {
    if (!map[error.fieldId]) {
      map[error.fieldId] = error.message;
    }
  }
  return map;
}

export function mapSectionErrorsById(
  errors: SectionValidationError[],
): Record<string, string> {
  const map: Record<string, string> = {};
  for (const error of errors) {
    map[error.sectionId] = error.message;
  }
  return map;
}
