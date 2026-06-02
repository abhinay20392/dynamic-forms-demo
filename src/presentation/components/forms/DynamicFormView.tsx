import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { FormSchema } from '../../../domain/entities/schema/form-schema';
import type { FormValues } from '../../../domain/entities/submission/field-values';
import { getSortedSections } from '../../../shared/utils/form-schema-utils';
import {
  FormProvider,
  type FormMode,
} from '../../forms/context/FormContext';
import { useFormState } from '../../forms/hooks/useFormState';
import { useFormValidation } from '../../forms/hooks/useFormValidation';
import { formColors, formSpacing } from '../../theme/forms';
import { SectionView } from './SectionView';

interface DynamicFormViewProps {
  schema: FormSchema;
  mode?: FormMode;
  initialValues?: FormValues;
  onSubmitSuccess?: (values: FormValues) => void;
}

export function DynamicFormView({
  schema,
  mode = 'create',
  initialValues,
  onSubmitSuccess,
}: DynamicFormViewProps) {
  const { values, setFieldValue: setValue, reset } = useFormState(
    schema,
    initialValues,
  );
  const validation = useFormValidation(schema, values, setValue);
  const sections = getSortedSections(schema);

  const onSubmit = () => {
    const result = validation.handleSubmit();
    if (result.isValid) {
      onSubmitSuccess?.(values);
      Alert.alert('Validation passed', 'Form is valid. Saving comes in Phase 6.');
      return;
    }
    const errorCount =
      result.fieldErrors.length + result.sectionErrors.length;
    Alert.alert(
      'Validation failed',
      `Please fix ${errorCount} issue(s) before submitting.`,
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
        <Pressable style={styles.submitButton} onPress={onSubmit}>
          <Text style={styles.submitLabel}>Submit</Text>
        </Pressable>
        <Pressable
          style={styles.resetButton}
          onPress={() => {
            reset();
            validation.resetValidation();
          }}>
          <Text style={styles.resetLabel}>Reset</Text>
        </Pressable>
        <View style={styles.statePreview}>
          <Text style={styles.stateTitle}>Current values (demo)</Text>
          <Text style={styles.stateJson}>
            {JSON.stringify(values, null, 2)}
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
