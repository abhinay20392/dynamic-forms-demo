import {
  generateRandomFormSchema,
  validateGeneratedSchemaReferences,
} from '../src/domain/services/random-schema-generator';
import { RuleEvaluator } from '../src/domain/services/rule-evaluator';
import { ValidationEngine } from '../src/domain/services/validation-engine';
import { VisibilityEngine } from '../src/domain/services/visibility-engine';

describe('RandomSchemaGenerator', () => {
  it('generates a valid schema with seeded output', () => {
    const schema = generateRandomFormSchema({ seed: 42 });
    expect(schema.id).toMatch(/^random-form-/);
    expect(schema.sections.length).toBeGreaterThanOrEqual(1);
    expect(schema.sections[0].fields.some(f => f.id === 'applicantName')).toBe(
      true,
    );
    validateGeneratedSchemaReferences(schema);
  });

  it('includes multiple field types when all sections are generated', () => {
    const schema = generateRandomFormSchema({ seed: 12345 });
    const types = new Set(
      schema.sections.flatMap(section => section.fields.map(f => f.type)),
    );
    expect(types.has('text')).toBe(true);
    expect(types.has('radio')).toBe(true);
  });

  it('always has a required visible text field in basics section', () => {
    for (let seed = 1; seed <= 20; seed += 1) {
      const schema = generateRandomFormSchema({ seed });
      const basics = schema.sections.find(s => s.id === 'basics');
      expect(basics).toBeDefined();
      const nameField = basics?.fields.find(f => f.id === 'applicantName');
      expect(nameField?.required).toBe(true);
      expect(nameField?.visibility).toBeUndefined();
    }
  });

  it('produces submittable path for basics-only values', () => {
    const schema = generateRandomFormSchema({ seed: 99 });
    const ruleEvaluator = new RuleEvaluator();
    const visibilityEngine = new VisibilityEngine(ruleEvaluator);
    const validationEngine = new ValidationEngine(
      ruleEvaluator,
      visibilityEngine,
    );

    const values = {
      applicantName: 'Demo User',
      applicationMode: 'student',
      countryCode: 'IN',
    };

    const visibility = visibilityEngine.resolve(schema, values);
    expect(visibility.visibleFieldIds.has('applicantName')).toBe(true);

    const validation = validationEngine.validate(schema, values);
    const basicsErrors = validation.fieldErrors.filter(
      e => e.fieldId === 'applicantName' || e.fieldId === 'applicationMode',
    );
    expect(basicsErrors).toHaveLength(0);
  });
});
