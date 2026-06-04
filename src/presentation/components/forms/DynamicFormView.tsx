import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { FormSchema } from '../../../domain/entities/schema/form-schema';
import type { FormSubmission } from '../../../domain/entities/submission/form-submission';
import type { FormValues } from '../../../domain/entities/submission/field-values';
import { getAppContainer } from '../../../infrastructure/di/app-container';
import { getSortedSections } from '../../../shared/utils/form-schema-utils';
import {
  FormProvider,
  type FormMode,
} from '../../forms/context/FormContext';
import { useFormState } from '../../forms/hooks/useFormState';
import { useFormValidation } from '../../forms/hooks/useFormValidation';
import { useFormVisibility } from '../../forms/hooks/useFormVisibility';
import { formColors, formSpacing } from '../../theme/forms';
import { SectionView } from './SectionView';

interface DynamicFormViewProps {
  schema: FormSchema;
  mode?: FormMode;
  initialValues?: FormValues;
  onSubmitSuccess?: (submission: FormSubmission) => void;
}

export function DynamicFormView({
  schema,
  mode = 'create',
  initialValues,
  onSubmitSuccess,
}: DynamicFormViewProps) {
  const { values, setValues, reset } = useFormState(schema, initialValues);
  const visibility = useFormVisibility(schema, values, setValues);
  const validation = useFormValidation(
    schema,
    values,
    visibility.setFieldValue,
    undefined,
    {
      visibleFieldIds: visibility.visibleFieldIds,
      visibleSectionIds: visibility.visibleSectionIds,
    },
  );
  const sections = getSortedSections(schema);
  const [saving, setSaving] = useState(false);
  const [savedSubmission, setSavedSubmission] = useState<FormSubmission | null>(
    null,
  );

  const onSubmit = async () => {
    const result = validation.handleSubmit();
    if (!result.isValid) {
      const errorCount =
        result.fieldErrors.length + result.sectionErrors.length;
      Alert.alert(
        'Validation failed',
        `Please fix ${errorCount} issue(s) before submitting.`,
      );
      return;
    }

    setSaving(true);
    const saveResult =
      await getAppContainer().createSubmissionUseCase.execute({
        schema,
        values,
        visibleFieldIds: visibility.visibleFieldIds,
      });
    setSaving(false);

    if (!saveResult.success) {
      Alert.alert('Save failed', saveResult.error);
      return;
    }

    setSavedSubmission(saveResult.data);
    onSubmitSuccess?.(saveResult.data);
    Alert.alert(
      'Submission saved',
      `Saved as ${saveResult.data.id}`,
    );
  };

  return (
    <FormProvider
      value={{
        schema,
        values,
        mode,
        setFieldValue: validation.setFieldValue,
        onFieldBlur: validation.onFieldBlur,
        shouldShowFieldError: validation.shouldShowFieldError,
        getFieldError: validation.getFieldError,
        shouldShowSectionError: validation.shouldShowSectionError,
        getSectionError: validation.getSectionError,
        isSectionVisible: visibility.isSectionVisible,
        isFieldVisible: visibility.isFieldVisible,
      }}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">
        {schema.description ? (
          <Text style={styles.formDescription}>{schema.description}</Text>
        ) : null}
        {sections.map(section => (
          <SectionView key={section.id} section={section} />
        ))}
        <Pressable
          style={[styles.submitButton, saving && styles.submitDisabled]}
          onPress={onSubmit}
          disabled={saving}>
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitLabel}>Submit</Text>
          )}
        </Pressable>
        <Pressable
          style={styles.resetButton}
          onPress={() => {
            reset();
            validation.resetValidation();
            setSavedSubmission(null);
          }}>
          <Text style={styles.resetLabel}>Reset</Text>
        </Pressable>
        <View style={styles.statePreview}>
          <Text style={styles.stateTitle}>
            {savedSubmission ? 'Saved result JSON' : 'Current values (demo)'}
          </Text>
          <Text style={styles.stateJson}>
            {JSON.stringify(
              savedSubmission ?? values,
              null,
              2,
            )}
          </Text>
        </View>
      </ScrollView>
    </FormProvider>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    padding: formSpacing.lg,
    paddingBottom: formSpacing.lg * 2,
  },
  formDescription: {
    fontSize: 14,
    color: formColors.textSecondary,
    marginBottom: formSpacing.lg,
  },
  submitButton: {
    marginTop: formSpacing.md,
    backgroundColor: formColors.primary,
    paddingVertical: formSpacing.md,
    borderRadius: 8,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  submitDisabled: {
    opacity: 0.7,
  },
  submitLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resetButton: {
    marginTop: formSpacing.sm,
    paddingVertical: formSpacing.sm,
    alignItems: 'center',
  },
  resetLabel: {
    color: formColors.primary,
    fontSize: 15,
  },
  statePreview: {
    marginTop: formSpacing.md,
    padding: formSpacing.md,
    borderRadius: 8,
    backgroundColor: formColors.surface,
  },
  stateTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: formColors.textSecondary,
    marginBottom: formSpacing.sm,
  },
  stateJson: {
    fontFamily: 'Menlo',
    fontSize: 11,
    color: formColors.text,
  },
});
