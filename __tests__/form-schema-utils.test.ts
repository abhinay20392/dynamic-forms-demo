import type { FormSchema } from '../src/domain';
import {
  buildInitialValues,
  getSortedFields,
  getSortedSections,
} from '../src/shared/utils/form-schema-utils';

const miniSchema: FormSchema = {
  id: 'mini',
  title: 'Mini',
  version: '1.0.0',
  sections: [
    {
      id: 's2',
      title: 'Second',
      order: 2,
      fields: [
        { id: 'b', label: 'B', type: 'checkbox', order: 1, options: [] },
      ],
    },
    {
      id: 's1',
      title: 'First',
      order: 1,
      fields: [
        { id: 'a', label: 'A', type: 'text', order: 2 },
        { id: 'c', label: 'C', type: 'radio', order: 1, options: [] },
      ],
    },
  ],
};

describe('form-schema-utils', () => {
  it('sorts sections by order', () => {
    const sections = getSortedSections(miniSchema);
    expect(sections.map(s => s.id)).toEqual(['s1', 's2']);
  });

  it('sorts fields by order', () => {
    const fields = getSortedFields(miniSchema.sections[1]);
    expect(fields.map(f => f.id)).toEqual(['c', 'a']);
  });

  it('builds default values by field type', () => {
    const values = buildInitialValues(miniSchema);
    expect(values.a).toBe('');
    expect(values.c).toBe('');
    expect(values.b).toEqual([]);
  });

  it('applies overrides', () => {
    const values = buildInitialValues(miniSchema, { a: 'hello' });
    expect(values.a).toBe('hello');
  });
});
