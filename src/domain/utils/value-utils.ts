import type { AttachmentValue, FieldValue } from '../entities/submission/field-values';

export function isAttachmentValue(value: unknown): value is AttachmentValue {
  return (
    typeof value === 'object' &&
    value !== null &&
    'cachedPath' in value &&
    typeof (value as AttachmentValue).cachedPath === 'string'
  );
}

export function isEmptyValue(value: FieldValue | undefined): boolean {
  if (value === undefined || value === null) {
    return true;
  }
  if (typeof value === 'string') {
    return value.trim().length === 0;
  }
  if (Array.isArray(value)) {
    return value.length === 0;
  }
  if (isAttachmentValue(value)) {
    return value.cachedPath.trim().length === 0;
  }
  return false;
}

export function asString(value: FieldValue | undefined): string {
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  return '';
}

export function asStringArray(value: FieldValue | undefined): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((item): item is string => typeof item === 'string');
}

export function getSelectionCount(value: FieldValue | undefined): number {
  return asStringArray(value).length;
}

export function asAttachment(value: FieldValue | undefined): AttachmentValue | null {
  if (isAttachmentValue(value)) {
    return value;
  }
  return null;
}
