import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { AttachmentValue } from '../../../domain/entities/submission/field-values';
import { formColors, formSpacing } from '../../theme/forms';
import { FieldErrorText } from './FieldErrorText';
import { FieldLabel } from './FieldLabel';

interface AttachmentFieldLayoutProps {
  label: string;
  required?: boolean;
  helperText?: string;
  attachment?: AttachmentValue;
  loading: boolean;
  pickerError: string | null;
  validationError?: string;
  showValidationError: boolean;
  onClear: () => void;
  children: React.ReactNode;
  previewUri?: string;
}

export function AttachmentFieldLayout({
  label,
  required,
  helperText,
  attachment,
  loading,
  pickerError,
  validationError,
  showValidationError,
  onClear,
  children,
  previewUri,
}: AttachmentFieldLayoutProps) {
  const displayError =
    pickerError ?? (showValidationError ? validationError : undefined);

  return (
    <View>
      <FieldLabel label={label} required={required} helperText={helperText} />
      {attachment ? (
        <View style={styles.selectedBox}>
          {previewUri ? (
            <Image source={{ uri: previewUri }} style={styles.preview} />
          ) : null}
          <View style={styles.meta}>
            <Text style={styles.fileName} numberOfLines={1}>
              {attachment.originalName}
            </Text>
            <Text style={styles.fileMeta}>
              {(attachment.sizeBytes / 1024).toFixed(1)} KB · {attachment.source}
            </Text>
            <Text style={styles.cachePath} numberOfLines={2}>
              {attachment.cachedPath}
            </Text>
          </View>
          <Pressable onPress={onClear} style={styles.clearButton}>
            <Text style={styles.clearLabel}>Remove</Text>
          </Pressable>
        </View>
      ) : null}
      <View style={styles.actions}>{children}</View>
      {loading ? (
        <ActivityIndicator
          style={styles.loader}
          color={formColors.primary}
        />
      ) : null}
      {displayError ? <FieldErrorText message={displayError} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  selectedBox: {
    borderWidth: 1,
    borderColor: formColors.border,
    borderRadius: 8,
    padding: formSpacing.md,
    marginBottom: formSpacing.sm,
    backgroundColor: formColors.surface,
  },
  preview: {
    width: '100%',
    height: 160,
    borderRadius: 6,
    marginBottom: formSpacing.sm,
    backgroundColor: formColors.border,
  },
  meta: {
    marginBottom: formSpacing.sm,
  },
  fileName: {
    fontSize: 15,
    fontWeight: '600',
    color: formColors.text,
  },
  fileMeta: {
    fontSize: 13,
    color: formColors.textSecondary,
    marginTop: formSpacing.xs,
  },
  cachePath: {
    fontSize: 11,
    color: formColors.placeholder,
    marginTop: formSpacing.xs,
  },
  clearButton: {
    alignSelf: 'flex-start',
  },
  clearLabel: {
    color: formColors.error,
    fontSize: 14,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: formSpacing.sm,
  },
  loader: {
    marginTop: formSpacing.sm,
  },
});
