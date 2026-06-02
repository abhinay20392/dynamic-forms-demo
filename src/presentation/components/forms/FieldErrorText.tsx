import { StyleSheet, Text } from 'react-native';
import { formColors, formSpacing } from '../../theme/forms';

interface FieldErrorTextProps {
  message: string;
}

export function FieldErrorText({ message }: FieldErrorTextProps) {
  return <Text style={styles.error}>{message}</Text>;
}

const styles = StyleSheet.create({
  error: {
    marginTop: formSpacing.xs,
    fontSize: 13,
    color: formColors.error,
  },
});
