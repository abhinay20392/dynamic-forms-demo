import type { FormSchema } from '../src/domain';
import type { FormSubmission } from '../src/domain/entities/submission/form-submission';
import { buildSubmissionSectionDisplay } from '../src/shared/utils/submission-display';

const schema: FormSchema = {
  id: 'f1',
  title: 'Form',
  version: '1.0.0',
  sections: [
    {
      id: 'personal',
      title: 'Personal',
      order: 1,
      fields: [
        { id: 'name', label: 'Name', type: 'text' },
        {
          id: 'photo',
          label: 'Photo',
          type: 'image',
        },
      ],
    },
  ],
};

describe('buildSubmissionSectionDisplay', () => {
  it('groups saved values by section', () => {
    const submission: FormSubmission = {
      id: 'sub-1',
      schemaId: 'f1',
      schemaVersion: '1.0.0',
      title: 'Form',
      values: {
        name: 'Jane',
        photo: {
          cachedPath: '/cache/photo.jpg',
          originalName: 'photo.jpg',
          mimeType: 'image/jpeg',
          sizeBytes: 1024,
          source: 'camera',
        },
      },
      createdAt: '2026-06-02T10:00:00.000Z',
    };

    const sections = buildSubmissionSectionDisplay(schema, submission);
    expect(sections).toHaveLength(1);
    expect(sections[0].fields).toHaveLength(2);
    expect(sections[0].fields[1].isImage).toBe(true);
    expect(sections[0].fields[1].attachmentPath).toContain('photo.jpg');
  });
});
