import { Pressable, Text } from 'react-native';
import type { FileFieldSchema } from '../../../domain/entities/schema/fields';
import { pickDocument } from '../../../infrastructure/pickers/document-picker.adapter';
import { useFormContext } from '../../forms/context/FormContext';
import { useAttachmentField } from '../../forms/hooks/useAttachmentField';
import { AttachmentFieldLayout } from './AttachmentFieldLayout';
import { pickerButtonStyles } from './picker-button-styles';

interface FilePickerFieldProps {
  field: FileFieldSchema;
}

export function FilePickerField({ field }: FilePickerFieldProps) {
  const {
    values,
    setFieldValue,
    onFieldBlur,
    shouldShowFieldError,
    getFieldError,
  } = useFormContext();

  const {
    attachment,
    loading,
    pickerError,
    persistAndSet,
    clearAttachment,
    setPickerError,
  } = useAttachmentField(field.id, values[field.id], (id, value) => {
      setFieldValue(id, value);
      onFieldBlur(id);
    });

  const pickFile = async () => {
    const pickResult = await pickDocument(field.allowedMimeTypes);
    if (!pickResult.success) {
      return;
    }
    if (!pickResult.data) {
      return;
    }

    const picked = pickResult.data;
    if (
      field.maxFileSizeBytes !== undefined &&
      picked.sizeBytes > field.maxFileSizeBytes
    ) {
      setPickerError('File exceeds maximum file size');
      return;
    }

    await persistAndSet({
      sourceUri: picked.uri,
      originalName: picked.name,
      mimeType: picked.mimeType,
      sizeBytes: picked.sizeBytes,
      source: 'file-picker',
    });
  };

  return (
    <AttachmentFieldLayout
      label={field.label}
      required={field.required}
      helperText={field.helperText}
      attachment={attachment}
      loading={loading}
      pickerError={pickerError}
      validationError={getFieldError(field.id)}
      showValidationError={shouldShowFieldError(field.id)}
      onClear={clearAttachment}>
      <Pressable
        style={[
          pickerButtonStyles.button,
          loading && pickerButtonStyles.buttonDisabled,
        ]}
        onPress={pickFile}
        disabled={loading}>
        <Text style={pickerButtonStyles.buttonLabel}>
          {attachment ? 'Replace file' : 'Choose from folder'}
        </Text>
      </Pressable>
    </AttachmentFieldLayout>
  );
}
