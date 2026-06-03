import { useCallback, useState } from 'react';
import type { FormSchema } from '../../../domain/entities/schema/form-schema';
import type { FieldValue, FormValues } from '../../../domain/entities/submission/field-values';
import { buildInitialValues } from '../../../shared/utils/form-schema-utils';

export interface UseFormStateResult {
  values: FormValues;
  setFieldValue: (fieldId: string, value: FieldValue | undefined) => void;
  setValues: (values: FormValues) => void;
  reset: () => void;
}

export function useFormState(
  schema: FormSchema,
  initialOverrides?: FormValues,
): UseFormStateResult {
  const [values, setValuesState] = useState<FormValues>(() =>
    buildInitialValues(schema, initialOverrides),
  );

  const setValues = useCallback((next: FormValues) => {
    setValuesState(next);
  }, []);

  const setFieldValue = useCallback(
    (fieldId: string, value: FieldValue | undefined) => {
      setValuesState(previous => ({ ...previous, [fieldId]: value }));
    },
    [],
  );

  const reset = useCallback(() => {
    setValuesState(buildInitialValues(schema, initialOverrides));
  }, [schema, initialOverrides]);

  return { values, setFieldValue, setValues, reset };
}
