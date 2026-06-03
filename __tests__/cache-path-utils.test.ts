import {
  buildCachedFilePath,
  getFormCacheDirectory,
} from '../src/infrastructure/storage/cache-path-utils';

describe('cache-path-utils', () => {
  it('builds form cache subdirectory', () => {
    expect(getFormCacheDirectory('/cache')).toBe('/cache/dynamic-forms');
  });

  it('sanitizes file names in cached path', () => {
    const path = buildCachedFilePath('/cache/dynamic-forms', 'my resume (1).pdf');
    expect(path).toMatch(/^\/cache\/dynamic-forms\/\d+-my_resume__1_.pdf$/);
  });
});
