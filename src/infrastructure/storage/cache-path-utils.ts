const CACHE_SUBDIR = 'dynamic-forms';

export function getFormCacheDirectory(cacheRoot: string): string {
  return `${cacheRoot}/${CACHE_SUBDIR}`;
}

export function buildCachedFilePath(
  cacheDirectory: string,
  originalName: string,
): string {
  const safeName = originalName.replace(/[^a-zA-Z0-9._-]/g, '_') || 'file';
  return `${cacheDirectory}/${Date.now()}-${safeName}`;
}
