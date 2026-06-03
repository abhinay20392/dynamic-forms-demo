import {
  launchCamera,
  launchImageLibrary,
  type Asset,
  type ImagePickerResponse,
} from 'react-native-image-picker';
import type { AttachmentSource } from '../../shared/constants/form';
import type { Result } from '../../shared/types/result';
import { err, ok } from '../../shared/types/result';

export interface PickedImage {
  uri: string;
  name: string;
  mimeType: string;
  sizeBytes: number;
  source: AttachmentSource;
}

function mapAsset(
  asset: Asset,
  source: AttachmentSource,
): PickedImage | null {
  if (!asset.uri) {
    return null;
  }
  const name =
    asset.fileName ??
    `image-${Date.now()}.${asset.type?.split('/')[1] ?? 'jpg'}`;
  return {
    uri: asset.uri,
    name,
    mimeType: asset.type ?? 'image/jpeg',
    sizeBytes: asset.fileSize ?? 0,
    source,
  };
}

function mapResponse(
  response: ImagePickerResponse,
  source: AttachmentSource,
): Result<PickedImage | null> {
  if (response.didCancel) {
    return ok(null);
  }
  if (response.errorCode) {
    if (response.errorCode === 'permission') {
      return err('Camera or photo library permission denied');
    }
    return err(response.errorMessage ?? 'Image picker failed');
  }

  const asset = response.assets?.[0];
  if (!asset) {
    return err('No image selected');
  }

  const mapped = mapAsset(asset, source);
  if (!mapped) {
    return err('Invalid image asset');
  }
  return ok(mapped);
}

export async function pickImageFromGallery(): Promise<
  Result<PickedImage | null>
> {
  const response = await launchImageLibrary({
    mediaType: 'photo',
    selectionLimit: 1,
    quality: 0.9,
  });
  return mapResponse(response, 'gallery');
}

export async function pickImageFromCamera(): Promise<Result<PickedImage | null>> {
  const response = await launchCamera({
    mediaType: 'photo',
    saveToPhotos: false,
    quality: 0.9,
  });
  return mapResponse(response, 'camera');
}
