import { RuleEvaluator } from '../src/domain/services/rule-evaluator';
import type { FormValues } from '../src/domain';

describe('RuleEvaluator', () => {
  const evaluator = new RuleEvaluator();

  const values: FormValues = {
    employmentType: 'self_employed',
    country: 'IN',
    businessName: 'Acme',
    interests: ['sports', 'tech'],
  };

  it('evaluates all (intersection)', () => {
    const passes = evaluator.evaluate(
      {
        all: [
          { field: 'employmentType', op: 'equals', value: 'self_employed' },
          { field: 'country', op: 'equals', value: 'IN' },
        ],
      },
      values,
    );
    expect(passes).toBe(true);
  });

  it('evaluates any (union)', () => {
    const passes = evaluator.evaluate(
      {
        any: [
          { field: 'employmentType', op: 'equals', value: 'student' },
          { field: 'country', op: 'equals', value: 'IN' },
        ],
      },
      values,
    );
    expect(passes).toBe(true);
  });

  it('evaluates not', () => {
    const passes = evaluator.evaluate(
      {
        not: { field: 'employmentType', op: 'equals', value: 'student' },
      },
      values,
    );
    expect(passes).toBe(true);
  });

  it('evaluates isEmpty and isNotEmpty', () => {
    expect(
      evaluator.evaluate(
        { all: [{ field: 'businessName', op: 'isNotEmpty' }] },
        values,
      ),
    ).toBe(true);
    expect(
      evaluator.evaluate(
        { all: [{ field: 'missing', op: 'isEmpty' }] },
        values,
      ),
    ).toBe(true);
  });

  it('evaluates in for checkbox selections', () => {
    const passes = evaluator.evaluate(
      {
        all: [{ field: 'interests', op: 'contains', value: 'sports' }],
      },
      values,
    );
    expect(passes).toBe(true);
  });
});
