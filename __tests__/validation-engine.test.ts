import type { FormSchema } from '../src/domain';
import { RuleEvaluator } from '../src/domain/services/rule-evaluator';
import { ValidationEngine } from '../src/domain/services/validation-engine';
import { VisibilityEngine } from '../src/domain/services/visibility-engine';

const ruleEvaluator = new RuleEvaluator();
const engine = new ValidationEngine(
  ruleEvaluator,
  new VisibilityEngine(ruleEvaluator),
);

const schema: FormSchema = {
  id: 'test',
  title: 'Test',
  version: '1.0.0',
  sections: [
    {
      id: 'main',
      title: 'Main',
      order: 1,
      fields: [
        {
          id: 'name',
          label: 'Name',
          type: 'text',
          validation: [
            { type: 'required', message: 'Name required' },
            { type: 'minLength', value: 2, message: 'Too short' },
          ],
        },
        {
          id: 'role',
          label: 'Role',
          type: 'radio',
          options: [
            { label: 'A', value: 'a' },
            { label: 'B', value: 'b' },
          ],
        },
        {
          id: 'company',
          label: 'Company',
          type: 'text',
          validation: [
            {
              type: 'required',
              message: 'Company required for role B',
              when: {
                all: [{ field: 'role', op: 'equals', value: 'b' }],
              },
            },
          ],
        },
      ],
    },
    {
      id: 'gated',
      title: 'Gated',
      order: 2,
      validation: {
        all: [{ field: 'role', op: 'notEquals', value: 'student' }],
      },
      fields: [],
    },
  ],
};

describe('ValidationEngine', () => {
  it('validates required and minLength', () => {
    const result = engine.validate(schema, { name: 'a', role: 'a' });
    expect(result.isValid).toBe(false);
    expect(result.fieldErrors.some(e => e.fieldId === 'name')).toBe(true);
  });

  it('applies dynamic required when when-condition matches', () => {
    const invalid = engine.validate(schema, {
      name: 'Jane',
      role: 'b',
      company: '',
    });
    expect(invalid.fieldErrors.some(e => e.fieldId === 'company')).toBe(true);

    const valid = engine.validate(schema, {
      name: 'Jane',
      role: 'b',
      company: 'Corp',
    });
    expect(valid.fieldErrors.some(e => e.fieldId === 'company')).toBe(false);
  });

  it('skips dynamic rule when when-condition does not match', () => {
    const result = engine.validate(schema, {
      name: 'Jane',
      role: 'a',
      company: '',
    });
    expect(result.fieldErrors.some(e => e.fieldId === 'company')).toBe(false);
  });

  it('validates section-level rules', () => {
    const result = engine.validate(schema, {
      name: 'Jane',
      role: 'student',
    });
    expect(result.sectionErrors.some(e => e.sectionId === 'gated')).toBe(true);
  });

  it('skips validation for hidden fields', () => {
    const visSchema: FormSchema = {
      id: 'vis',
      title: 'Vis',
      version: '1.0.0',
      sections: [
        {
          id: 'main',
          title: 'Main',
          order: 1,
          fields: [
            { id: 'role', label: 'Role', type: 'text' },
            {
              id: 'secret',
              label: 'Secret',
              type: 'text',
              required: true,
              visibility: {
                all: [{ field: 'role', op: 'equals', value: 'admin' }],
              },
            },
          ],
        },
      ],
    };
    const result = engine.validate(visSchema, {
      role: 'user',
      secret: '',
    });
    expect(result.fieldErrors.some(e => e.fieldId === 'secret')).toBe(false);
  });

  it('adds implicit required from field.required flag', () => {
    const mini: FormSchema = {
      id: 'mini',
      title: 'Mini',
      version: '1.0.0',
      sections: [
        {
          id: 's',
          title: 'S',
          order: 1,
          fields: [
            {
              id: 'code',
              label: 'Code',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    };
    const result = engine.validate(mini, { code: '' });
    expect(result.fieldErrors.some(e => e.fieldId === 'code')).toBe(true);
  });
});
