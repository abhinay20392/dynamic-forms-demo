import type { FieldSchema } from '../entities/schema/fields';
import type { FormSchema } from '../entities/schema/form-schema';
import type { SectionSchema } from '../entities/schema/sections';
import type { VisibilityRule } from '../entities/schema/rules';
import type { FormValues } from '../entities/submission/field-values';
import type { IRuleEvaluator } from './rule-evaluator';

export interface VisibilitySnapshot {
  visibleSectionIds: ReadonlySet<string>;
  visibleFieldIds: ReadonlySet<string>;
  hiddenFieldIds: ReadonlySet<string>;
}

export interface IVisibilityEngine {
  resolve(schema: FormSchema, values: FormValues): VisibilitySnapshot;
  isSectionVisible(
    section: SectionSchema,
    schema: FormSchema,
    values: FormValues,
  ): boolean;
  isFieldVisible(
    field: FieldSchema,
    section: SectionSchema,
    schema: FormSchema,
    values: FormValues,
  ): boolean;
}

export class VisibilityEngine implements IVisibilityEngine {
  constructor(private readonly ruleEvaluator: IRuleEvaluator) {}

  resolve(schema: FormSchema, values: FormValues): VisibilitySnapshot {
    const visibleSectionIds = new Set<string>();
    const visibleFieldIds = new Set<string>();
    const hiddenFieldIds = new Set<string>();

    for (const section of schema.sections) {
      const sectionVisible = this.isSectionVisible(section, schema, values);
      if (sectionVisible) {
        visibleSectionIds.add(section.id);
      }

      for (const field of section.fields) {
        const fieldVisible =
          sectionVisible &&
          this.isFieldVisible(field, section, schema, values);
        if (fieldVisible) {
          visibleFieldIds.add(field.id);
        } else {
          hiddenFieldIds.add(field.id);
        }
      }
    }

    return {
      visibleSectionIds,
      visibleFieldIds,
      hiddenFieldIds,
    };
  }

  isSectionVisible(
    section: SectionSchema,
    _schema: FormSchema,
    values: FormValues,
  ): boolean {
    return this.evaluateVisibilityRule(section.visibility, values);
  }

  isFieldVisible(
    field: FieldSchema,
    section: SectionSchema,
    schema: FormSchema,
    values: FormValues,
  ): boolean {
    if (!this.isSectionVisible(section, schema, values)) {
      return false;
    }
    return this.evaluateVisibilityRule(field.visibility, values);
  }

  private evaluateVisibilityRule(
    rule: VisibilityRule | undefined,
    values: FormValues,
  ): boolean {
    if (!rule) {
      return true;
    }
    return this.ruleEvaluator.evaluate(rule, values);
  }
}
