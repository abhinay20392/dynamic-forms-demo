import type { FormSchema } from '../src/domain';
import {
  applyHiddenValueClear,
  buildInitialValues,
} from '../src/shared/utils/form-schema-utils';

const schema: FormSchema = {
  id: 'clear-test',
  title: 'Clear',
  version: '1.0.0',
  sections: [
    {
      id: 's1',
      title: 'S1',
      order: 1,
      fields: [
        { id: 'name', label: 'Name', type: 'text' },
        {
          id: 'tags',
          label: 'Tags',
          type: 'checkbox',
          options: [{ label: 'A', value: 'a' }],
        },
      ],
    },
  ],
};

describe('applyHiddenValueClear', () => {
  it('clears hidden text and checkbox values', () => {
    const values = {
      name: 'Jane',
      tags: ['a'],
    };
    const cleared = applyHiddenValueClear(
      schema,
      values,
      new Set(['name', 'tags']),
    );
    expect(cleared.name).toBe('');
    expect(cleared.tags).toEqual([]);
  });

  it('returns same reference when nothing to clear', () => {
    const values = buildInitialValues(schema);
    const result = applyHiddenValueClear(schema, values, new Set());
    expect(result).toBe(values);
  });
});
