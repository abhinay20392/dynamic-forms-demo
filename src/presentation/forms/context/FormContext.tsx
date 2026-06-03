import { createContext, useContext, type ReactNode } from 'react';
import type { FormSchema } from '../../../domain/entities/schema/form-schema';
import type { FieldValue, FormValues } from '../../../domain/entities/submission/field-values';

export type FormMode = 'create' | 'edit';

export interface FormContextValue {
  schema: FormSchema;
  values: FormValues;
  mode: FormMode;
  setFieldValue: (fieldId: string, value: FieldValue | undefined) => void;
  onFieldBlur: (fieldId: string) => void;
  shouldShowFieldError: (fieldId: string) => boolean;
  getFieldError: (fieldId: string) => string | undefined;
  shouldShowSectionError: (sectionId: string) => boolean;
  getSectionError: (sectionId: string) => string | undefined;
  isSectionVisible: (sectionId: string) => boolean;
  isFieldVisible: (fieldId: string) => boolean;
}

const FormContext = createContext<FormContextValue | null>(null);

interface FormProviderProps {
  value: FormContextValue;
  children: ReactNode;
}

export function FormProvider({ value, children }: FormProviderProps) {
  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
}

export function useFormContext(): FormContextValue {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within FormProvider');
  }
  return context;
}
