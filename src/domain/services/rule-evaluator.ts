import type { RuleGroup } from '../entities/schema/rules';
import type { FormValues } from '../entities/submission/field-values';

/**
 * Evaluates visibility/validation condition trees (Phase 3–4).
 * Implementations live in domain or infrastructure depending on purity needs.
 */
export interface IRuleEvaluator {
  evaluate(rule: RuleGroup, values: FormValues): boolean;
}
