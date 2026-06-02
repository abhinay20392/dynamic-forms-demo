import type { FormSchema } from '../../domain/entities/schema/form-schema';

/**
 * Maps raw JSON (e.g. from assets or API) to domain `FormSchema`.
 * Phase 1: identity cast after runtime guard; later add normalization.
 */
export function mapJsonToFormSchema(raw: unknown): FormSchema {
  return raw as FormSchema;
}
