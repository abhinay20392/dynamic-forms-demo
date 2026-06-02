import type { AttachmentSource } from '../../../shared/constants/form';

export interface AttachmentValue {
  cachedPath: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  source: AttachmentSource;
}

export type ScalarFieldValue = string | number | boolean | null;

export type FieldValue =
  | ScalarFieldValue
  | string[]
  | AttachmentValue
  | AttachmentValue[];

/** Runtime form state keyed by field id. */
export type FormValues = Record<string, FieldValue | undefined>;
