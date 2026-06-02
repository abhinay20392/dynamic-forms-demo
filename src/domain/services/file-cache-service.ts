import type { AttachmentSource } from '../../shared/constants/form';
import type { AttachmentValue } from '../entities/submission/field-values';
import type { Result } from '../../shared/types/result';

export interface PersistAssetInput {
  sourceUri: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  source: AttachmentSource;
}

/** Copies picked assets into app cache (Phase 5). */
export interface IFileCacheService {
  persistAsset(input: PersistAssetInput): Promise<Result<AttachmentValue>>;
  deleteCachedFile(cachedPath: string): Promise<Result<void>>;
}
