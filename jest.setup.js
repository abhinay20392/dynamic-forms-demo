jest.mock('react-native-blob-util', () => ({
  __esModule: true,
  default: {
    fs: {
      dirs: { CacheDir: '/mock-cache' },
      isDir: jest.fn(async () => false),
      mkdir: jest.fn(async () => undefined),
      cp: jest.fn(async () => undefined),
      exists: jest.fn(async () => true),
      unlink: jest.fn(async () => undefined),
    },
  },
}));

jest.mock('@react-native-documents/picker', () => ({
  pick: jest.fn(),
  keepLocalCopy: jest.fn(),
  types: {
    allFiles: 'allFiles',
    pdf: 'application/pdf',
    images: 'image/*',
    plainText: 'text/plain',
  },
  errorCodes: {
    OPERATION_CANCELED: 'OPERATION_CANCELED',
  },
  isErrorWithCode: jest.fn(() => false),
}));

jest.mock('react-native-image-picker', () => ({
  launchCamera: jest.fn(),
  launchImageLibrary: jest.fn(),
}));

const asyncStorage: Record<string, string> = {};

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    setItem: jest.fn(async (key, value) => {
      asyncStorage[key] = value;
    }),
    getItem: jest.fn(async key => asyncStorage[key] ?? null),
    removeItem: jest.fn(async key => {
      delete asyncStorage[key];
    }),
    clear: jest.fn(async () => {
      Object.keys(asyncStorage).forEach(key => delete asyncStorage[key]);
    }),
  },
}));
