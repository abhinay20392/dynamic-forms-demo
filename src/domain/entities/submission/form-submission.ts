import type { FormValues } from './field-values';

export interface FormSubmission {
  id: string;
  schemaId: string;
  schemaVersion: string;
  title: string;
  values: FormValues;
  createdAt: string;
  updatedAt?: string;
}

export interface FormSubmissionSummary {
  id: string;
  schemaId: string;
  title: string;
  createdAt: string;
  updatedAt?: string;
}
