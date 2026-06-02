import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { CheckboxFieldSchema } from '../../../domain/entities/schema/fields';
import { useFormContext } from '../../forms/context/FormContext';
import { formColors, formSpacing } from '../../theme/forms';
import { FieldErrorText } from './FieldErrorText';
import { FieldLabel } from './FieldLabel';

interface CheckboxGroupFieldProps {
  field: CheckboxFieldSchema;
}

export function CheckboxGroupField({ field }: CheckboxGroupFieldProps) {
  const {
    values,
    setFieldValue,
    onFieldBlur,
    shouldShowFieldError,
    getFieldError,
  } = useFormContext();
  const selected = (values[field.id] as string[] | undefined) ?? [];
  const hasError = shouldShowFieldError(field.id);
  const errorMessage = getFieldError(field.id);

  const toggle = (optionValue: string) => {
    const next = selected.includes(optionValue)
      ? selected.filter(v => v !== optionValue)
      : [...selected, optionValue];
    setFieldValue(field.id, next);
    onFieldBlur(field.id);
  };

  return (
    <>
      <FieldLabel
        label={field.label}
        required={field.required}
        helperText={field.helperText}
      />
      <View style={[styles.options, hasError && styles.optionsError]}>
        {field.options.map(option => {
          const isSelected = selected.includes(option.value);
          return (
            <Pressable
              key={option.value}
              style={[styles.option, isSelected && styles.optionSelected]}
              onPress={() => toggle(option.value)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: isSelected }}>
              <View
                style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                {isSelected ? <Text style={styles.checkmark}>✓</Text> : null}
              </View>
              <Text style={styles.optionLabel}>{option.label}</Text>
            </Pressable>
          );
        })}
      </View>
      {hasError && errorMessage ? (
        <FieldErrorText message={errorMessage} />
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  options: {
    gap: formSpacing.sm,
    borderRadius: 8,
  },
  optionsError: {
    padding: formSpacing.xs,
    borderWidth: 1,
    borderColor: formColors.error,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: formSpacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: formColors.border,
    backgroundColor: formColors.background,
  },
  optionSelected: {
    borderColor: formColors.primary,
    backgroundColor: formColors.primaryMuted,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: formColors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: formSpacing.md,
  },
  checkboxSelected: {
    borderColor: formColors.primary,
    backgroundColor: formColors.primary,
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 16,
  },
  optionLabel: {
    fontSize: 16,
    color: formColors.text,
    flex: 1,
  },
});
