import type { FormSchema } from '../../domain/entities/schema/form-schema';
import type { FieldSchema } from '../../domain/entities/schema/fields';
import type { SectionSchema } from '../../domain/entities/schema/sections';
import type { FieldValue, FormValues } from '../../domain/entities/submission/field-values';

export function getSortedSections(schema: FormSchema): SectionSchema[] {
  return [...schema.sections].sort((a, b) => a.order - b.order);
}

export function getSortedFields(section: SectionSchema): FieldSchema[] {
  return [...section.fields].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0),
  );
}

export function getDefaultFieldValue(field: FieldSchema): FieldValue | undefined {
  if (field.defaultValue !== undefined) {
    return field.defaultValue as FieldValue;
  }
  switch (field.type) {
    case 'text':
    case 'radio':
      return '';
    case 'checkbox':
      return [];
    case 'file':
    case 'image':
      return undefined;
    default:
      return undefined;
  }
}

export function buildInitialValues(
  schema: FormSchema,
  overrides?: FormValues,
): FormValues {
  const values: FormValues = {};

  for (const section of schema.sections) {
    for (const field of section.fields) {
      values[field.id] = getDefaultFieldValue(field);
    }
  }

  if (overrides) {
    for (const [fieldId, value] of Object.entries(overrides)) {
      values[fieldId] = value;
    }
  }

  return values;
}

export function getAllFields(schema: FormSchema): FieldSchema[] {
  return schema.sections.flatMap(section => section.fields);
}
