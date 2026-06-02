import type { ConditionOperator } from '../../../shared/constants/form';

/** Single predicate against a field value (any section). */
export interface FieldCondition {
  field: string;
  op: ConditionOperator;
  /** Omitted for unary ops (`isEmpty`, `isNotEmpty`). */
  value?: unknown;
}

export type RuleExpression = FieldCondition | RuleGroup;

/**
 * Composable rule tree. Intersection = `all`, union = `any`, negation = `not`.
 * Cross-section: `field` ids are global across the form.
 */
export interface RuleGroup {
  all?: RuleExpression[];
  any?: RuleExpression[];
  not?: RuleExpression;
}

export type VisibilityRule = RuleGroup;

export type ValidationRuleType =
  | 'required'
  | 'minLength'
  | 'maxLength'
  | 'pattern'
  | 'minSelections'
  | 'maxSelections'
  | 'allowedMimeTypes'
  | 'maxFileSizeBytes';

/** Static validation rule applied to a field. */
export interface StaticValidationRule {
  type: ValidationRuleType;
  message?: string;
  value?: number | string | string[];
}

/**
 * Dynamic validation: rule applies only when `when` evaluates to true.
 * `when` supports intersection (`all`) across fields in any section.
 */
export interface DynamicValidationRule extends StaticValidationRule {
  when: RuleGroup;
}

export type FieldValidationRule = StaticValidationRule | DynamicValidationRule;

export function isDynamicValidationRule(
  rule: FieldValidationRule,
): rule is DynamicValidationRule {
  return 'when' in rule && rule.when !== undefined;
}
