import { StyleSheet } from 'react-native';
import { formColors, formSpacing } from '../../theme/forms';

export const pickerButtonStyles = StyleSheet.create({
  button: {
    paddingHorizontal: formSpacing.md,
    paddingVertical: formSpacing.sm + 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: formColors.primary,
    backgroundColor: formColors.primaryMuted,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonLabel: {
    color: formColors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});
