import type { FieldSchema } from './fields';
import type { RuleGroup, VisibilityRule } from './rules';

export interface SectionSchema {
  id: string;
  title: string;
  order: number;
  description?: string;
  visibility?: VisibilityRule;
  /** Section-level validation (e.g. all visible fields in section must pass custom gate). */
  validation?: RuleGroup;
  fields: FieldSchema[];
}
