import type { FormSchema } from '../src/domain';
import {
  buildFormSubmission,
  buildSubmissionResult,
} from '../src/domain/services/submission-result-builder';
import type { AttachmentValue } from '../src/domain/entities/submission/field-values';

const schema: FormSchema = {
  id: 'form-1',
  title: 'Test Form',
  version: '1.0.0',
  sections: [
    {
      id: 's1',
      title: 'Section',
      order: 1,
      fields: [
        { id: 'name', label: 'Name', type: 'text' },
        { id: 'hiddenField', label: 'Hidden', type: 'text' },
        { id: 'tags', label: 'Tags', type: 'checkbox', options: [] },
        { id: 'doc', label: 'Doc', type: 'file' },
      ],
    },
  ],
};

const attachment: AttachmentValue = {
  cachedPath: '/cache/dynamic-forms/resume.pdf',
  originalName: 'resume.pdf',
  mimeType: 'application/pdf',
  sizeBytes: 2048,
  source: 'file-picker',
};

describe('submission-result-builder', () => {
  it('includes only visible non-empty values', () => {
    const visible = new Set(['name', 'doc']);
    const values = {
      name: 'Jane',
      hiddenField: 'secret',
      tags: [],
      doc: attachment,
    };

    const result = buildSubmissionResult(schema, values, visible);
    expect(result.schemaId).toBe('form-1');
    expect(result.values).toEqual({
      name: 'Jane',
      doc: attachment,
    });
    expect(result.values.hiddenField).toBeUndefined();
    expect(result.values.tags).toBeUndefined();
  });

  it('builds FormSubmission with id and timestamps', () => {
    const submission = buildFormSubmission(
      schema,
      { name: 'Bob' },
      new Set(['name']),
      'sub-123',
      '2026-06-02T10:00:00.000Z',
    );
    expect(submission.id).toBe('sub-123');
    expect(submission.createdAt).toBe('2026-06-02T10:00:00.000Z');
    expect(submission.values.name).toBe('Bob');
  });
});
