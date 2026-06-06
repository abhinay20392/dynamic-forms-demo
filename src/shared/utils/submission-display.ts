import type { FieldSchema } from '../../domain/entities/schema/fields';
import type { FormSchema } from '../../domain/entities/schema/form-schema';
import type { FormSubmission } from '../../domain/entities/submission/form-submission';
import type { FieldValue } from '../../domain/entities/submission/field-values';
import { isAttachmentValue } from '../../domain/utils/value-utils';
import { getSortedFields, getSortedSections } from './form-schema-utils';

export interface SubmissionFieldDisplay {
  fieldId: string;
  label: string;
  type: FieldSchema['type'];
  displayValue: string;
  attachmentPath?: string;
  isImage?: boolean;
}

export interface SubmissionSectionDisplay {
  sectionId: string;
  title: string;
  fields: SubmissionFieldDisplay[];
}

function formatFieldValue(field: FieldSchema, value: FieldValue): SubmissionFieldDisplay {
  if (Array.isArray(value)) {
    return {
      fieldId: field.id,
      label: field.label,
      type: field.type,
      displayValue: value.join(', ') || '—',
    };
  }

  if (isAttachmentValue(value)) {
    return {
      fieldId: field.id,
      label: field.label,
      type: field.type,
      displayValue: `${value.originalName} (${(value.sizeBytes / 1024).toFixed(1)} KB)`,
      attachmentPath: value.cachedPath,
      isImage: field.type === 'image',
    };
  }

  if (typeof value === 'boolean') {
    return {
      fieldId: field.id,
      label: field.label,
      type: field.type,
      displayValue: value ? 'Yes' : 'No',
    };
  }

  return {
    fieldId: field.id,
    label: field.label,
    type: field.type,
    displayValue: value === null || value === undefined || value === ''
      ? '—'
      : String(value),
  };
}

export function buildSubmissionSectionDisplay(
  schema: FormSchema,
  submission: FormSubmission,
): SubmissionSectionDisplay[] {
  const sections: SubmissionSectionDisplay[] = [];

  for (const section of getSortedSections(schema)) {
    const fields: SubmissionFieldDisplay[] = [];

    for (const field of getSortedFields(section)) {
      const value = submission.values[field.id];
      if (value === undefined) {
        continue;
      }
      fields.push(formatFieldValue(field, value));
    }

    if (fields.length > 0) {
      sections.push({
        sectionId: section.id,
        title: section.title,
        fields,
      });
    }
  }

  return sections;
}

export function formatSubmissionDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export function toPreviewUri(cachedPath: string): string {
  return cachedPath.startsWith('file://') ? cachedPath : `file://${cachedPath}`;
}
