import type { FieldCondition, RuleExpression, RuleGroup } from '../entities/schema/rules';
import type { FormValues } from '../entities/submission/field-values';
import {
  asString,
  asStringArray,
  isEmptyValue,
} from '../utils/value-utils';

export interface IRuleEvaluator {
  evaluate(rule: RuleGroup, values: FormValues): boolean;
}

function isRuleGroup(expression: RuleExpression): expression is RuleGroup {
  return (
    typeof expression === 'object' &&
    expression !== null &&
    ('all' in expression || 'any' in expression || 'not' in expression) &&
    !('field' in expression)
  );
}

export class RuleEvaluator implements IRuleEvaluator {
  evaluate(rule: RuleGroup, values: FormValues): boolean {
    if (rule.all !== undefined) {
      return rule.all.every(expression =>
        this.evaluateExpression(expression, values),
      );
    }
    if (rule.any !== undefined) {
      return rule.any.some(expression =>
        this.evaluateExpression(expression, values),
      );
    }
    if (rule.not !== undefined) {
      return !this.evaluateExpression(rule.not, values);
    }
    return true;
  }

  private evaluateExpression(
    expression: RuleExpression,
    values: FormValues,
  ): boolean {
    if (isRuleGroup(expression)) {
      return this.evaluate(expression, values);
    }
    return this.evaluateCondition(expression, values);
  }

  private evaluateCondition(
    condition: FieldCondition,
    values: FormValues,
  ): boolean {
    const fieldValue = values[condition.field];

    switch (condition.op) {
      case 'equals':
        return fieldValue === condition.value;
      case 'notEquals':
        return fieldValue !== condition.value;
      case 'in':
        return (
          Array.isArray(condition.value) &&
          condition.value.some(item => item === fieldValue)
        );
      case 'notIn':
        return (
          Array.isArray(condition.value) &&
          !condition.value.some(item => item === fieldValue)
        );
      case 'contains': {
        if (Array.isArray(fieldValue)) {
          return fieldValue.some(item => item === condition.value);
        }
        const text = asString(fieldValue);
        return text.includes(String(condition.value ?? ''));
      }
      case 'greaterThan':
        return Number(fieldValue) > Number(condition.value);
      case 'greaterThanOrEqual':
        return Number(fieldValue) >= Number(condition.value);
      case 'lessThan':
        return Number(fieldValue) < Number(condition.value);
      case 'lessThanOrEqual':
        return Number(fieldValue) <= Number(condition.value);
      case 'isEmpty':
        return isEmptyValue(fieldValue);
      case 'isNotEmpty':
        return !isEmptyValue(fieldValue);
      default:
        return false;
    }
  }
}
