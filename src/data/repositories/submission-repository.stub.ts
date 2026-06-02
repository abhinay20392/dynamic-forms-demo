import type {
  FormSubmission,
  FormSubmissionSummary,
} from '../../domain/entities/submission/form-submission';
import type { ISubmissionRepository } from '../../domain/repositories/submission-repository';
import { err, type Result } from '../../shared/types/result';

/** Placeholder until Phase 6 (AsyncStorage / file-backed implementation). */
export class SubmissionRepositoryStub implements ISubmissionRepository {
  async list(): Promise<Result<FormSubmissionSummary[]>> {
    return err('SubmissionRepository not implemented (Phase 6)');
  }

  async getById(_id: string): Promise<Result<FormSubmission>> {
    return err('SubmissionRepository not implemented (Phase 6)');
  }

  async create(_submission: FormSubmission): Promise<Result<FormSubmission>> {
    return err('SubmissionRepository not implemented (Phase 6)');
  }

  async update(_submission: FormSubmission): Promise<Result<FormSubmission>> {
    return err('SubmissionRepository not implemented (Phase 6)');
  }

  async delete(_id: string): Promise<Result<void>> {
    return err('SubmissionRepository not implemented (Phase 6)');
  }
}
