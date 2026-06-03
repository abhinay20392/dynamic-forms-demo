import type { FormSchema } from '../src/domain';
import { RuleEvaluator } from '../src/domain/services/rule-evaluator';
import { VisibilityEngine } from '../src/domain/services/visibility-engine';

const engine = new VisibilityEngine(new RuleEvaluator());

const schema: FormSchema = {
  id: 'vis-test',
  title: 'Visibility Test',
  version: '1.0.0',
  sections: [
    {
      id: 'employment',
      title: 'Employment',
      order: 1,
      fields: [
        {
          id: 'employmentType',
          label: 'Type',
          type: 'radio',
          options: [
            { label: 'Employed', value: 'employed' },
            { label: 'Self', value: 'self_employed' },
          ],
        },
        { id: 'country', label: 'Country', type: 'text' },
      ],
    },
    {
      id: 'business',
      title: 'Business',
      order: 2,
      visibility: {
        all: [
          { field: 'employmentType', op: 'equals', value: 'self_employed' },
          { field: 'country', op: 'equals', value: 'IN' },
        ],
      },
      fields: [
        { id: 'businessName', label: 'Business Name', type: 'text' },
        {
          id: 'gstNumber',
          label: 'GST',
          type: 'text',
          visibility: {
            all: [{ field: 'businessName', op: 'isNotEmpty' }],
          },
        },
      ],
    },
  ],
};

describe('VisibilityEngine', () => {
  it('shows all sections/fields when no rules', () => {
    const mini: FormSchema = {
      id: 'mini',
      title: 'Mini',
      version: '1.0.0',
      sections: [
        {
          id: 's1',
          title: 'S1',
          order: 1,
          fields: [{ id: 'a', label: 'A', type: 'text' }],
        },
      ],
    };
    const snapshot = engine.resolve(mini, { a: 'x' });
    expect(snapshot.visibleSectionIds.has('s1')).toBe(true);
    expect(snapshot.visibleFieldIds.has('a')).toBe(true);
  });

  it('hides section when intersection rule fails', () => {
    const snapshot = engine.resolve(schema, {
      employmentType: 'employed',
      country: 'IN',
    });
    expect(snapshot.visibleSectionIds.has('business')).toBe(false);
    expect(snapshot.hiddenFieldIds.has('businessName')).toBe(true);
    expect(snapshot.hiddenFieldIds.has('gstNumber')).toBe(true);
  });

  it('shows section and field when all conditions pass', () => {
    const snapshot = engine.resolve(schema, {
      employmentType: 'self_employed',
      country: 'IN',
      businessName: '',
    });
    expect(snapshot.visibleSectionIds.has('business')).toBe(true);
    expect(snapshot.visibleFieldIds.has('businessName')).toBe(true);
    expect(snapshot.hiddenFieldIds.has('gstNumber')).toBe(true);
  });

  it('shows nested field when businessName is filled', () => {
    const snapshot = engine.resolve(schema, {
      employmentType: 'self_employed',
      country: 'IN',
      businessName: 'Acme',
    });
    expect(snapshot.visibleFieldIds.has('gstNumber')).toBe(true);
  });
});
