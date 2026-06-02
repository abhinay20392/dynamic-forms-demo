import { StyleSheet, Text, View } from 'react-native';
import { formColors, formSpacing } from '../../theme/forms';

interface FieldLabelProps {
  label: string;
  required?: boolean;
  helperText?: string;
}

export function FieldLabel({ label, required, helperText }: FieldLabelProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required ? <Text style={styles.required}> *</Text> : null}
      </Text>
      {helperText ? <Text style={styles.helper}>{helperText}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: formSpacing.sm,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: formColors.text,
  },
  required: {
    color: formColors.error,
  },
  helper: {
    marginTop: formSpacing.xs,
    fontSize: 13,
    color: formColors.textSecondary,
  },
});
