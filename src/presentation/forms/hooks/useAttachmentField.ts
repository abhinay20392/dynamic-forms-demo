import { useCallback, useState } from 'react';
import type { AttachmentValue } from '../../../domain/entities/submission/field-values';
import type { IFileCacheService } from '../../../domain/services/file-cache-service';
import { getAppContainer } from '../../../infrastructure/di/app-container';
import { isAttachmentValue } from '../../../domain/utils/value-utils';

interface PersistInput {
  sourceUri: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  source: AttachmentValue['source'];
}

export function useAttachmentField(
  fieldId: string,
  currentValue: unknown,
  setFieldValue: (fieldId: string, value: AttachmentValue | undefined) => void,
  fileCacheService: IFileCacheService = getAppContainer().fileCacheService,
) {
  const [loading, setLoading] = useState(false);
  const [pickerError, setPickerError] = useState<string | null>(null);

  const attachment = isAttachmentValue(currentValue) ? currentValue : undefined;

  const persistAndSet = useCallback(
    async (input: PersistInput) => {
      setLoading(true);
      setPickerError(null);

      if (attachment?.cachedPath) {
        await fileCacheService.deleteCachedFile(attachment.cachedPath);
      }

      const result = await fileCacheService.persistAsset(input);
      setLoading(false);

      if (result.success) {
        setFieldValue(fieldId, result.data);
        return true;
      }
      setPickerError(result.error);
      return false;
    },
    [attachment?.cachedPath, fieldId, fileCacheService, setFieldValue],
  );

  const clearAttachment = useCallback(async () => {
    if (attachment?.cachedPath) {
      await fileCacheService.deleteCachedFile(attachment.cachedPath);
    }
    setFieldValue(fieldId, undefined);
    setPickerError(null);
  }, [attachment?.cachedPath, fieldId, fileCacheService, setFieldValue]);

  return {
    attachment,
    loading,
    pickerError,
    persistAndSet,
    clearAttachment,
    setPickerError,
  };
}
