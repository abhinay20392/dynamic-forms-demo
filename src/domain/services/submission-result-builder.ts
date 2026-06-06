import type { FormSchema } from '../entities/schema/form-schema';
import type { FormSubmission } from '../entities/submission/form-submission';
import type { FormValues } from '../entities/submission/field-values';
import { getAllFields } from '../../shared/utils/form-schema-utils';
import { isEmptyValue } from '../utils/value-utils';

export interface SubmissionResultPayload {
  schemaId: string;
  schemaVersion: string;
  title: string;
  submittedAt: string;
  values: FormValues;
}

/**
 * Builds normalized submission JSON from visible fields only.
 * Hidden fields are excluded; empty visible values are omitted.
 */
export function buildSubmissionResult(
  schema: FormSchema,
  values: FormValues,
  visibleFieldIds: ReadonlySet<string>,
  submittedAt: string = new Date().toISOString(),
): SubmissionResultPayload {
  const outputValues: FormValues = {};

  for (const field of getAllFields(schema)) {
    if (!visibleFieldIds.has(field.id)) {
      continue;
    }
    const value = values[field.id];
    if (value === undefined || isEmptyValue(value)) {
      continue;
    }
    outputValues[field.id] = value;
  }

  return {
    schemaId: schema.id,
    schemaVersion: schema.version,
    title: schema.title,
    submittedAt,
    values: outputValues,
  };
}

export function buildFormSubmission(
  schema: FormSchema,
  values: FormValues,
  visibleFieldIds: ReadonlySet<string>,
  id: string,
  createdAt: string = new Date().toISOString(),
): FormSubmission {
  const result = buildSubmissionResult(
    schema,
    values,
    visibleFieldIds,
    createdAt,
  );

  return {
    id,
    schemaId: result.schemaId,
    schemaVersion: result.schemaVersion,
    title: result.title,
    values: result.values,
    createdAt: result.submittedAt,
  };
}

export function buildFormSubmissionUpdate(
  existing: FormSubmission,
  schema: FormSchema,
  values: FormValues,
  visibleFieldIds: ReadonlySet<string>,
  updatedAt: string = new Date().toISOString(),
): FormSubmission {
  const result = buildSubmissionResult(
    schema,
    values,
    visibleFieldIds,
    updatedAt,
  );

  return {
    id: existing.id,
    schemaId: result.schemaId,
    schemaVersion: result.schemaVersion,
    title: result.title,
    values: result.values,
    createdAt: existing.createdAt,
    updatedAt: result.submittedAt,
  };
}
