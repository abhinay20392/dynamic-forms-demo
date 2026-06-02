import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { RadioFieldSchema } from '../../../domain/entities/schema/fields';
import { useFormContext } from '../../forms/context/FormContext';
import { formColors, formSpacing } from '../../theme/forms';
import { FieldLabel } from './FieldLabel';

interface RadioGroupFieldProps {
  field: RadioFieldSchema;
}

export function RadioGroupField({ field }: RadioGroupFieldProps) {
  const { values, setFieldValue } = useFormContext();
  const selected = (values[field.id] as string | undefined) ?? '';

  return (
    <>
      <FieldLabel
        label={field.label}
        required={field.required}
        helperText={field.helperText}
      />
      <View style={styles.options}>
        {field.options.map(option => {
          const isSelected = selected === option.value;
          return (
            <Pressable
              key={option.value}
              style={[styles.option, isSelected && styles.optionSelected]}
              onPress={() => setFieldValue(field.id, option.value)}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}>
              <View
                style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                {isSelected ? <View style={styles.radioInner} /> : null}
              </View>
              <Text style={styles.optionLabel}>{option.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  options: {
    gap: formSpacing.sm,
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
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: formColors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: formSpacing.md,
  },
  radioOuterSelected: {
    borderColor: formColors.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: formColors.primary,
  },
  optionLabel: {
    fontSize: 16,
    color: formColors.text,
    flex: 1,
  },
});
