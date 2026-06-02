import { useCallback, useEffect, useMemo, useState } from 'react';
import type { FormSchema } from '../../../domain/entities/schema/form-schema';
import type { FormValidationResult } from '../../../domain/entities/validation/validation-result';
import type { FieldValue, FormValues } from '../../../domain/entities/submission/field-values';
import {
  mapFieldErrorsById,
  mapSectionErrorsById,
} from '../../../domain/services/validation-engine';
import type { IValidationEngine } from '../../../domain/services/validation-engine';
import { getAppContainer } from '../../../infrastructure/di/app-container';

const emptyResult: FormValidationResult = {
  isValid: true,
  fieldErrors: [],
  sectionErrors: [],
};

export interface UseFormValidationResult {
  fieldErrorsById: Record<string, string>;
  sectionErrorsById: Record<string, string>;
  submitAttempted: boolean;
  shouldShowFieldError: (fieldId: string) => boolean;
  shouldShowSectionError: (sectionId: string) => boolean;
  getFieldError: (fieldId: string) => string | undefined;
  getSectionError: (sectionId: string) => string | undefined;
  touchField: (fieldId: string) => void;
  onFieldBlur: (fieldId: string) => void;
  setFieldValue: (fieldId: string, value: FieldValue | undefined) => void;
  validateAll: () => FormValidationResult;
  handleSubmit: () => FormValidationResult;
  resetValidation: () => void;
  lastResult: FormValidationResult;
}

export function useFormValidation(
  schema: FormSchema,
  values: FormValues,
  setValue: (fieldId: string, value: FieldValue | undefined) => void,
  validationEngine: IValidationEngine = getAppContainer().validationEngine,
): UseFormValidationResult {
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [lastResult, setLastResult] =
    useState<FormValidationResult>(emptyResult);

  const runValidation = useCallback(
    (nextValues: FormValues) => {
      const result = validationEngine.validate(schema, nextValues);
      setLastResult(result);
      return result;
    },
    [schema, validationEngine],
  );

  useEffect(() => {
    if (submitAttempted || Object.keys(touched).length > 0) {
      runValidation(values);
    }
  }, [values, touched, submitAttempted, runValidation]);

  const fieldErrorsById = useMemo(
    () => mapFieldErrorsById(lastResult.fieldErrors),
    [lastResult.fieldErrors],
  );

  const sectionErrorsById = useMemo(
    () => mapSectionErrorsById(lastResult.sectionErrors),
    [lastResult.sectionErrors],
  );

  const touchField = useCallback((fieldId: string) => {
    setTouched(previous => ({ ...previous, [fieldId]: true }));
  }, []);

  const onFieldBlur = useCallback(
    (fieldId: string) => {
      touchField(fieldId);
      runValidation(values);
    },
    [touchField, runValidation, values],
  );

  const setFieldValue = useCallback(
    (fieldId: string, value: FieldValue | undefined) => {
      setValue(fieldId, value);
      if (touched[fieldId] || submitAttempted) {
        const nextValues = { ...values, [fieldId]: value };
        runValidation(nextValues);
      }
    },
    [setValue, touched, submitAttempted, values, runValidation],
  );

  const validateAll = useCallback(() => {
    return runValidation(values);
  }, [runValidation, values]);

  const resetValidation = useCallback(() => {
    setTouched({});
    setSubmitAttempted(false);
    setLastResult(emptyResult);
  }, []);

  const handleSubmit = useCallback(() => {
    setSubmitAttempted(true);
    const allFieldIds = schema.sections.flatMap(section =>
      section.fields.map(field => field.id),
    );
    setTouched(previous => {
      const next = { ...previous };
      for (const fieldId of allFieldIds) {
        next[fieldId] = true;
      }
      return next;
    });
    return runValidation(values);
  }, [schema.sections, runValidation, values]);

  const shouldShowFieldError = useCallback(
    (fieldId: string) =>
      Boolean(
        (touched[fieldId] || submitAttempted) && fieldErrorsById[fieldId],
      ),
    [touched, submitAttempted, fieldErrorsById],
  );

  const shouldShowSectionError = useCallback(
    (sectionId: string) =>
      Boolean(submitAttempted && sectionErrorsById[sectionId]),
    [submitAttempted, sectionErrorsById],
  );

  const getFieldError = useCallback(
    (fieldId: string) => fieldErrorsById[fieldId],
    [fieldErrorsById],
  );

  const getSectionError = useCallback(
    (sectionId: string) => sectionErrorsById[sectionId],
    [sectionErrorsById],
  );

  return {
    fieldErrorsById,
    sectionErrorsById,
    submitAttempted,
    shouldShowFieldError,
    shouldShowSectionError,
    getFieldError,
    getSectionError,
    touchField,
    onFieldBlur,
    setFieldValue,
    validateAll,
    handleSubmit,
    resetValidation,
    lastResult,
  };
}
