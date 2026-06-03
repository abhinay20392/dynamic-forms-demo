import { Pressable, Text } from 'react-native';
import type { ImageFieldSchema } from '../../../domain/entities/schema/fields';
import {
  pickImageFromCamera,
  pickImageFromGallery,
} from '../../../infrastructure/pickers/image-picker.adapter';
import { useFormContext } from '../../forms/context/FormContext';
import { useAttachmentField } from '../../forms/hooks/useAttachmentField';
import { AttachmentFieldLayout } from './AttachmentFieldLayout';
import { pickerButtonStyles } from './picker-button-styles';

interface ImagePickerFieldProps {
  field: ImageFieldSchema;
}

function toPreviewUri(cachedPath: string): string {
  return cachedPath.startsWith('file://') ? cachedPath : `file://${cachedPath}`;
}

export function ImagePickerField({ field }: ImagePickerFieldProps) {
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

  const allowGallery = field.allowGallery !== false;
  const allowCamera = field.allowCamera !== false;

  const handlePick = async (
    pickFn: () => ReturnType<typeof pickImageFromGallery>,
  ) => {
    const pickResult = await pickFn();
    if (!pickResult.success) {
      setPickerError(pickResult.error);
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
      setPickerError('Image exceeds maximum file size');
      return;
    }

    await persistAndSet({
      sourceUri: picked.uri,
      originalName: picked.name,
      mimeType: picked.mimeType,
      sizeBytes: picked.sizeBytes,
      source: picked.source,
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
      onClear={clearAttachment}
      previewUri={attachment ? toPreviewUri(attachment.cachedPath) : undefined}>
      {allowGallery ? (
        <Pressable
          style={[
            pickerButtonStyles.button,
            loading && pickerButtonStyles.buttonDisabled,
          ]}
          onPress={() => handlePick(pickImageFromGallery)}
          disabled={loading}>
          <Text style={pickerButtonStyles.buttonLabel}>Gallery / folder</Text>
        </Pressable>
      ) : null}
      {allowCamera ? (
        <Pressable
          style={[
            pickerButtonStyles.button,
            loading && pickerButtonStyles.buttonDisabled,
          ]}
          onPress={() => handlePick(pickImageFromCamera)}
          disabled={loading}>
          <Text style={pickerButtonStyles.buttonLabel}>Camera</Text>
        </Pressable>
      ) : null}
    </AttachmentFieldLayout>
  );
}
