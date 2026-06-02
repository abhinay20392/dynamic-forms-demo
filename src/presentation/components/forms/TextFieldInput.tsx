import { StyleSheet, TextInput } from 'react-native';
import type { TextFieldSchema } from '../../../domain/entities/schema/fields';
import { useFormContext } from '../../forms/context/FormContext';
import { formColors, formSpacing } from '../../theme/forms';
import { FieldErrorText } from './FieldErrorText';
import { FieldLabel } from './FieldLabel';

interface TextFieldInputProps {
  field: TextFieldSchema;
}

export function TextFieldInput({ field }: TextFieldInputProps) {
  const {
    values,
    setFieldValue,
    onFieldBlur,
    shouldShowFieldError,
    getFieldError,
  } = useFormContext();
  const value = (values[field.id] as string | undefined) ?? '';
  const hasError = shouldShowFieldError(field.id);
  const errorMessage = getFieldError(field.id);

  return (
    <>
      <FieldLabel
        label={field.label}
        required={field.required}
        helperText={field.helperText}
      />
      <TextInput
        style={[styles.input, hasError && styles.inputError]}
        value={value}
        onChangeText={text => setFieldValue(field.id, text)}
        onBlur={() => onFieldBlur(field.id)}
        placeholder={field.placeholder}
        placeholderTextColor={formColors.placeholder}
        keyboardType={field.keyboardType ?? 'default'}
        maxLength={field.maxLength}
        autoCapitalize="none"
      />
      {hasError && errorMessage ? (
        <FieldErrorText message={errorMessage} />
      ) : null}
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
  inputError: {
    borderColor: formColors.error,
  },
});
