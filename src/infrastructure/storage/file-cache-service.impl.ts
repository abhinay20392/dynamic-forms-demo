import ReactNativeBlobUtil from 'react-native-blob-util';
import type {
  IFileCacheService,
  PersistAssetInput,
} from '../../domain/services/file-cache-service';
import type { AttachmentValue } from '../../domain/entities/submission/field-values';
import { err, ok, type Result } from '../../shared/types/result';
import {
  buildCachedFilePath,
  getFormCacheDirectory,
} from './cache-path-utils';

export class FileCacheServiceImpl implements IFileCacheService {
  async persistAsset(input: PersistAssetInput): Promise<Result<AttachmentValue>> {
    try {
      const cacheDir = getFormCacheDirectory(
        ReactNativeBlobUtil.fs.dirs.CacheDir,
      );
      const dirExists = await ReactNativeBlobUtil.fs.isDir(cacheDir);
      if (!dirExists) {
        await ReactNativeBlobUtil.fs.mkdir(cacheDir);
      }

      const destPath = buildCachedFilePath(cacheDir, input.originalName);
      await ReactNativeBlobUtil.fs.cp(input.sourceUri, destPath);

      return ok({
        cachedPath: destPath,
        originalName: input.originalName,
        mimeType: input.mimeType,
        sizeBytes: input.sizeBytes,
        source: input.source,
      });
    } catch {
      return err('Failed to copy file to cache');
    }
  }

  async deleteCachedFile(cachedPath: string): Promise<Result<void>> {
    try {
      const exists = await ReactNativeBlobUtil.fs.exists(cachedPath);
      if (exists) {
        await ReactNativeBlobUtil.fs.unlink(cachedPath);
      }
      return ok(undefined);
    } catch {
      return err('Failed to delete cached file');
    }
  }
}
