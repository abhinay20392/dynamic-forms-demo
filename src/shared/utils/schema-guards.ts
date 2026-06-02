import { FIELD_TYPES, HIDDEN_VALUE_POLICIES } from '../constants/form';
import type { FormSchema } from '../../domain/entities/schema/form-schema';

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function hasString(obj: Record<string, unknown>, key: string): boolean {
  return typeof obj[key] === 'string' && (obj[key] as string).length > 0;
}

/**
 * Lightweight runtime check for bundled/demo schemas.
 * Full JSON Schema validation can be added in Phase 9 if needed.
 */
export function assertFormSchema(value: unknown): asserts value is FormSchema {
  if (!isObject(value)) {
    throw new Error('Form schema must be an object');
  }
  if (!hasString(value, 'id') || !hasString(value, 'title') || !hasString(value, 'version')) {
    throw new Error('Form schema requires id, title, and version');
  }
  if (
    value.hiddenValuePolicy !== undefined &&
    !HIDDEN_VALUE_POLICIES.includes(
      value.hiddenValuePolicy as (typeof HIDDEN_VALUE_POLICIES)[number],
    )
  ) {
    throw new Error(`Invalid hiddenValuePolicy: ${String(value.hiddenValuePolicy)}`);
  }
  if (!Array.isArray(value.sections) || value.sections.length === 0) {
    throw new Error('Form schema requires at least one section');
  }

  const fieldIds = new Set<string>();

  for (const section of value.sections) {
    if (!isObject(section)) {
      throw new Error('Each section must be an object');
    }
    if (!hasString(section, 'id') || !hasString(section, 'title')) {
      throw new Error('Each section requires id and title');
    }
    if (typeof section.order !== 'number') {
      throw new Error(`Section ${section.id} requires numeric order`);
    }
    if (!Array.isArray(section.fields)) {
      throw new Error(`Section ${section.id} requires fields array`);
    }

    for (const field of section.fields) {
      if (!isObject(field)) {
        throw new Error('Each field must be an object');
      }
      if (!hasString(field, 'id') || !hasString(field, 'label') || !hasString(field, 'type')) {
        throw new Error('Each field requires id, label, and type');
      }
      if (!FIELD_TYPES.includes(field.type as (typeof FIELD_TYPES)[number])) {
        throw new Error(`Unsupported field type: ${String(field.type)}`);
      }
      if (fieldIds.has(field.id as string)) {
        throw new Error(`Duplicate field id: ${field.id as string}`);
      }
      fieldIds.add(field.id as string);
    }
  }
}
