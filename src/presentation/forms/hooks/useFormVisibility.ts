import { useCallback, useMemo } from 'react';
import type { FormSchema } from '../../../domain/entities/schema/form-schema';
import type { FieldValue, FormValues } from '../../../domain/entities/submission/field-values';
import type { IVisibilityEngine } from '../../../domain/services/visibility-engine';
import {
  applyHiddenValueClear,
} from '../../../shared/utils/form-schema-utils';
import { getAppContainer } from '../../../infrastructure/di/app-container';

export interface UseFormVisibilityResult {
  isSectionVisible: (sectionId: string) => boolean;
  isFieldVisible: (fieldId: string) => boolean;
  visibleFieldIds: ReadonlySet<string>;
  visibleSectionIds: ReadonlySet<string>;
  setFieldValue: (fieldId: string, value: FieldValue | undefined) => void;
}

export function useFormVisibility(
  schema: FormSchema,
  values: FormValues,
  setValues: (values: FormValues) => void,
  visibilityEngine: IVisibilityEngine = getAppContainer().visibilityEngine,
): UseFormVisibilityResult {
  const policy = schema.hiddenValuePolicy ?? 'clear';

  const snapshot = useMemo(
    () => visibilityEngine.resolve(schema, values),
    [schema, values, visibilityEngine],
  );

  const applyHiddenPolicy = useCallback(
    (draft: FormValues): FormValues => {
      if (policy !== 'clear') {
        return draft;
      }
      const afterVisibility = visibilityEngine.resolve(schema, draft);
      return applyHiddenValueClear(
        schema,
        draft,
        afterVisibility.hiddenFieldIds,
      );
    },
    [schema, policy, visibilityEngine],
  );

  const setFieldValue = useCallback(
    (fieldId: string, value: FieldValue | undefined) => {
      const draft = { ...values, [fieldId]: value };
      setValues(applyHiddenPolicy(draft));
    },
    [values, setValues, applyHiddenPolicy],
  );

  const isSectionVisible = useCallback(
    (sectionId: string) => snapshot.visibleSectionIds.has(sectionId),
    [snapshot.visibleSectionIds],
  );

  const isFieldVisible = useCallback(
    (fieldId: string) => snapshot.visibleFieldIds.has(fieldId),
    [snapshot.visibleFieldIds],
  );

  return {
    isSectionVisible,
    isFieldVisible,
    visibleFieldIds: snapshot.visibleFieldIds,
    visibleSectionIds: snapshot.visibleSectionIds,
    setFieldValue,
  };
}
