import {
  errorCodes,
  isErrorWithCode,
  keepLocalCopy,
  pick,
  types,
  type DocumentPickerResponse,
} from '@react-native-documents/picker';
import type { Result } from '../../shared/types/result';
import { err, ok } from '../../shared/types/result';

export interface PickedDocument {
  uri: string;
  name: string;
  mimeType: string;
  sizeBytes: number;
}

function mapMimeToPickerType(mime: string): string {
  if (mime === 'application/pdf') {
    return types.pdf;
  }
  if (mime.startsWith('image/')) {
    return types.images;
  }
  if (mime.startsWith('text/')) {
    return types.plainText;
  }
  return mime;
}

async function resolveReadableUri(
  file: DocumentPickerResponse,
): Promise<Result<string>> {
  const name = file.name ?? 'document';

  if (file.isVirtual && file.convertibleToMimeTypes?.length) {
    const targetMime =
      file.convertibleToMimeTypes[0]?.mimeType ?? file.type ?? 'application/pdf';
    const [copyResult] = await keepLocalCopy({
      files: [
        {
          uri: file.uri,
          fileName: name,
          convertVirtualFileToType: targetMime,
        },
      ],
      destination: 'cachesDirectory',
    });
    if (copyResult.status === 'success') {
      return ok(copyResult.localUri);
    }
    return err(copyResult.copyError ?? 'Failed to export virtual file');
  }

  if (file.uri.startsWith('content://')) {
    const [copyResult] = await keepLocalCopy({
      files: [{ uri: file.uri, fileName: name }],
      destination: 'cachesDirectory',
    });
    if (copyResult.status === 'success') {
      return ok(copyResult.localUri);
    }
    return err(copyResult.copyError ?? 'Failed to copy file locally');
  }

  return ok(file.uri);
}

export async function pickDocument(
  allowedMimeTypes?: string[],
): Promise<Result<PickedDocument | null>> {
  try {
    const pickerTypes =
      allowedMimeTypes && allowedMimeTypes.length > 0
        ? [...new Set(allowedMimeTypes.map(mapMimeToPickerType))]
        : [types.allFiles];

    const results = await pick({
      type: pickerTypes.length === 1 ? pickerTypes[0] : pickerTypes,
      allowMultiSelection: false,
      mode: 'import',
    });

    const file = results[0];
    if (!file?.uri) {
      return err('No file selected');
    }

    if (file.hasRequestedType === false) {
      return err('Selected file type is not allowed');
    }

    const uriResult = await resolveReadableUri(file);
    if (!uriResult.success) {
      return uriResult;
    }

    return ok({
      uri: uriResult.data,
      name: file.name ?? 'document',
      mimeType: file.type ?? 'application/octet-stream',
      sizeBytes: file.size ?? 0,
    });
  } catch (error) {
    if (
      isErrorWithCode(error) &&
      error.code === errorCodes.OPERATION_CANCELED
    ) {
      return ok(null);
    }
    return err('Could not open file picker');
  }
}
