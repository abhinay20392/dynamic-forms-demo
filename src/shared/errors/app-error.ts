export type AppErrorCode =
  | 'SCHEMA_NOT_FOUND'
  | 'SCHEMA_INVALID'
  | 'SUBMISSION_NOT_FOUND'
  | 'VALIDATION_FAILED'
  | 'FILE_CACHE_FAILED'
  | 'PERMISSION_DENIED'
  | 'UNKNOWN';

export class AppError extends Error {
  readonly code: AppErrorCode;

  constructor(code: AppErrorCode, message: string) {
    super(message);
    this.name = 'AppError';
    this.code = code;
  }
}
