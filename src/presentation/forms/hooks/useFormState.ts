import { useCallback, useState } from 'react';
import type { FormSchema } from '../../../domain/entities/schema/form-schema';
import type { FieldValue, FormValues } from '../../../domain/entities/submission/field-values';
import { buildInitialValues } from '../../../shared/utils/form-schema-utils';

export interface UseFormStateResult {
  values: FormValues;
  setFieldValue: (fieldId: string, value: FieldValue | undefined) => void;
  reset: () => void;
}

export function useFormState(
  schema: FormSchema,
  initialOverrides?: FormValues,
): UseFormStateResult {
  const [values, setValues] = useState<FormValues>(() =>
    buildInitialValues(schema, initialOverrides),
  );

  const setFieldValue = useCallback(
    (fieldId: string, value: FieldValue | undefined) => {
      setValues(previous => ({ ...previous, [fieldId]: value }));
    },
    [],
  );

  const reset = useCallback(() => {
    setValues(buildInitialValues(schema, initialOverrides));
  }, [schema, initialOverrides]);

  return { values, setFieldValue, reset };
}
