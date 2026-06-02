/** Validation output (engine implementation in Phase 3). */
export interface FieldValidationError {
  fieldId: string;
  message: string;
  ruleType?: string;
}

export interface SectionValidationError {
  sectionId: string;
  message: string;
}

export interface FormValidationResult {
  isValid: boolean;
  fieldErrors: FieldValidationError[];
  sectionErrors: SectionValidationError[];
}
