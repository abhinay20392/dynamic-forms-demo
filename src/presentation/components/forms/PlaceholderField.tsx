import { StyleSheet, Text, View } from 'react-native';
import type { FieldSchema } from '../../../domain/entities/schema/fields';
import { useFormContext } from '../../forms/context/FormContext';
import { formColors, formSpacing } from '../../theme/forms';
import { FieldErrorText } from './FieldErrorText';
import { FieldLabel } from './FieldLabel';

interface PlaceholderFieldProps {
  field: FieldSchema;
  message: string;
}

export function PlaceholderField({ field, message }: PlaceholderFieldProps) {
  const { shouldShowFieldError, getFieldError } = useFormContext();
  const hasError = shouldShowFieldError(field.id);
  const errorMessage = getFieldError(field.id);

  return (
    <View>
      <FieldLabel
        label={field.label}
        required={field.required}
        helperText={field.helperText}
      />
      <View style={[styles.box, hasError && styles.boxError]}>
        <Text style={styles.message}>{message}</Text>
      </View>
      {hasError && errorMessage ? (
        <FieldErrorText message={errorMessage} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    padding: formSpacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: formColors.border,
    borderStyle: 'dashed',
    backgroundColor: formColors.surface,
  },
  boxError: {
    borderColor: formColors.error,
    borderStyle: 'solid',
  },
  message: {
    fontSize: 14,
    color: formColors.textSecondary,
  },
});
