import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { FormSchema } from '../../domain/entities/schema/form-schema';
import type { FormValues } from '../../domain/entities/submission/field-values';
import { DynamicFormView } from '../components/forms/DynamicFormView';
import type { FormMode } from '../forms/context/FormContext';
import { formColors, formSpacing } from '../theme/forms';

interface DynamicFormScreenProps {
  schema: FormSchema;
  mode?: FormMode;
  initialValues?: FormValues;
  onBack: () => void;
}

export function DynamicFormScreen({
  schema,
  mode = 'create',
  initialValues,
  onBack,
}: DynamicFormScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <Text style={styles.backLabel}>← Back</Text>
        </Pressable>
        <View style={styles.toolbarText}>
          <Text style={styles.title} numberOfLines={1}>
            {schema.title}
          </Text>
          {mode === 'edit' ? (
            <Text style={styles.modeBadge}>Edit mode</Text>
          ) : null}
        </View>
      </View>
      <DynamicFormView
        schema={schema}
        mode={mode}
        initialValues={initialValues}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: formColors.background,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: formSpacing.md,
    paddingVertical: formSpacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: formColors.border,
  },
  backButton: {
    paddingRight: formSpacing.md,
    paddingVertical: formSpacing.sm,
  },
  backLabel: {
    fontSize: 16,
    color: formColors.primary,
    fontWeight: '600',
  },
  toolbarText: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: formColors.text,
  },
  modeBadge: {
    fontSize: 12,
    color: formColors.primary,
    marginTop: 2,
  },
});
