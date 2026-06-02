import { StyleSheet, Text, View } from 'react-native';
import type { FieldSchema } from '../../../domain/entities/schema/fields';
import { formColors, formSpacing } from '../../theme/forms';
import { FieldLabel } from './FieldLabel';

interface PlaceholderFieldProps {
  field: FieldSchema;
  message: string;
}

export function PlaceholderField({ field, message }: PlaceholderFieldProps) {
  return (
    <View>
      <FieldLabel
        label={field.label}
        required={field.required}
        helperText={field.helperText}
      />
      <View style={styles.box}>
        <Text style={styles.message}>{message}</Text>
      </View>
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
  message: {
    fontSize: 14,
    color: formColors.textSecondary,
  },
});
