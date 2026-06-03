import ReactNativeBlobUtil from 'react-native-blob-util';
import { FileCacheServiceImpl } from '../src/infrastructure/storage/file-cache-service.impl';

describe('FileCacheServiceImpl', () => {
  const service = new FileCacheServiceImpl();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('persists asset to cache directory', async () => {
    const result = await service.persistAsset({
      sourceUri: 'file:///tmp/source.pdf',
      originalName: 'resume.pdf',
      mimeType: 'application/pdf',
      sizeBytes: 1024,
      source: 'file-picker',
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.cachedPath).toContain('/mock-cache/dynamic-forms/');
      expect(result.data.originalName).toBe('resume.pdf');
      expect(result.data.mimeType).toBe('application/pdf');
      expect(result.data.source).toBe('file-picker');
    }
    expect(ReactNativeBlobUtil.fs.mkdir).toHaveBeenCalled();
    expect(ReactNativeBlobUtil.fs.cp).toHaveBeenCalled();
  });

  it('deletes cached file when it exists', async () => {
    const result = await service.deleteCachedFile('/mock-cache/dynamic-forms/file.pdf');
    expect(result.success).toBe(true);
    expect(ReactNativeBlobUtil.fs.unlink).toHaveBeenCalled();
  });
});
