import type { HiddenValuePolicy } from '../../../shared/constants/form';
import type { SectionSchema } from './sections';

export interface FormSchema {
  id: string;
  title: string;
  version: string;
  description?: string;
  /**
   * When a field/section is hidden: `clear` removes its value from state;
   * `retain` keeps value but excludes from validation (default: `clear`).
   */
  hiddenValuePolicy?: HiddenValuePolicy;
  sections: SectionSchema[];
}
