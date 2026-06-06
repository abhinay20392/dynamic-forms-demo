import type { FormSchema } from '../entities/schema/form-schema';
import type { FormSubmission } from '../entities/submission/form-submission';
import type { FormValues } from '../entities/submission/field-values';
import type { ISubmissionRepository } from '../repositories/submission-repository';
import { buildFormSubmissionUpdate } from '../services/submission-result-builder';
import type { Result } from '../../shared/types/result';
import { err } from '../../shared/types/result';

export interface UpdateSubmissionInput {
  existing: FormSubmission;
  schema: FormSchema;
  values: FormValues;
  visibleFieldIds: ReadonlySet<string>;
}

export class UpdateSubmissionUseCase {
  constructor(
    private readonly submissionRepository: ISubmissionRepository,
  ) {}

  async execute(input: UpdateSubmissionInput): Promise<Result<FormSubmission>> {
    const { existing, schema, values, visibleFieldIds } = input;

    if (visibleFieldIds.size === 0) {
      return err('No visible fields to submit');
    }

    const updated = buildFormSubmissionUpdate(
      existing,
      schema,
      values,
      visibleFieldIds,
    );

    return this.submissionRepository.update(updated);
  }
}
