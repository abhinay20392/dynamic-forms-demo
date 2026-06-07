import type { FormSchema } from '../src/domain';
import { assertFormSchema } from '../src/shared/utils/schema-guards';

const validSchema: FormSchema = {
  id: 'valid',
  title: 'Valid',
  version: '1.0.0',
  sections: [
    {
      id: 's1',
      title: 'Section',
      order: 1,
      fields: [{ id: 'name', label: 'Name', type: 'text' }],
    },
  ],
};

describe('assertFormSchema', () => {
  it('accepts a valid schema', () => {
    expect(() => assertFormSchema(validSchema)).not.toThrow();
  });

  it('rejects duplicate field ids', () => {
    const invalid = {
      ...validSchema,
      sections: [
        {
          id: 's1',
          title: 'S',
          order: 1,
          fields: [
            { id: 'dup', label: 'A', type: 'text' },
            { id: 'dup', label: 'B', type: 'text' },
          ],
        },
      ],
    };
    expect(() => assertFormSchema(invalid)).toThrow(/Duplicate field id/);
  });

  it('rejects unsupported field type', () => {
    const invalid = {
      ...validSchema,
      sections: [
        {
          id: 's1',
          title: 'S',
          order: 1,
          fields: [{ id: 'x', label: 'X', type: 'unknown' }],
        },
      ],
    };
    expect(() => assertFormSchema(invalid)).toThrow(/Unsupported field type/);
  });
});
