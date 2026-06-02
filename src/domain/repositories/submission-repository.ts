import type {
  FormSubmission,
  FormSubmissionSummary,
} from '../entities/submission/form-submission';
import type { Result } from '../../shared/types/result';

export interface ISubmissionRepository {
  list(): Promise<Result<FormSubmissionSummary[]>>;
  getById(id: string): Promise<Result<FormSubmission>>;
  create(submission: FormSubmission): Promise<Result<FormSubmission>>;
  update(submission: FormSubmission): Promise<Result<FormSubmission>>;
  delete(id: string): Promise<Result<void>>;
}
