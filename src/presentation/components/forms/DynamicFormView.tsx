import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { FormSchema } from '../../../domain/entities/schema/form-schema';
import type { FormValues } from '../../../domain/entities/submission/field-values';
import { getSortedSections } from '../../../shared/utils/form-schema-utils';
import {
  FormProvider,
  type FormMode,
} from '../../forms/context/FormContext';
import { useFormState } from '../../forms/hooks/useFormState';
import { formColors, formSpacing } from '../../theme/forms';
import { SectionView } from './SectionView';

interface DynamicFormViewProps {
  schema: FormSchema;
  mode?: FormMode;
  initialValues?: FormValues;
}

export function DynamicFormView({
  schema,
  mode = 'create',
  initialValues,
}: DynamicFormViewProps) {
  const { values, setFieldValue } = useFormState(schema, initialValues);
  const sections = getSortedSections(schema);

  return (
    <FormProvider
      value={{
        schema,
        values,
        mode,
        setFieldValue,
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
