import { StyleSheet, TextInput } from 'react-native';
import type { TextFieldSchema } from '../../../domain/entities/schema/fields';
import { useFormContext } from '../../forms/context/FormContext';
import { formColors, formSpacing } from '../../theme/forms';
import { FieldLabel } from './FieldLabel';

interface TextFieldInputProps {
  field: TextFieldSchema;
}

export function TextFieldInput({ field }: TextFieldInputProps) {
  const { values, setFieldValue } = useFormContext();
  const value = (values[field.id] as string | undefined) ?? '';

  return (
    <>
      <FieldLabel
        label={field.label}
        required={field.required}
        helperText={field.helperText}
      />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={text => setFieldValue(field.id, text)}
        placeholder={field.placeholder}
        placeholderTextColor={formColors.placeholder}
        keyboardType={field.keyboardType ?? 'default'}
        maxLength={field.maxLength}
        autoCapitalize="none"
      />
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: formColors.border,
    borderRadius: 8,
    paddingHorizontal: formSpacing.md,
    paddingVertical: formSpacing.sm + 4,
    fontSize: 16,
    color: formColors.text,
    backgroundColor: formColors.background,
  },
});
