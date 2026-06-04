import type { FormSchema } from '../src/domain';
import type { FormSubmission } from '../src/domain/entities/submission/form-submission';
import type { ISubmissionRepository } from '../src/domain/repositories/submission-repository';
import { CreateSubmissionUseCase } from '../src/domain/use-cases/create-submission';
import { ok } from '../src/shared/types/result';

class InMemorySubmissionRepository implements ISubmissionRepository {
  items: FormSubmission[] = [];

  async list() {
    return ok(
      this.items.map(item => ({
        id: item.id,
        schemaId: item.schemaId,
        title: item.title,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })),
    );
  }

  async getById(id: string) {
    const found = this.items.find(item => item.id === id);
    return found ? ok(found) : { success: false as const, error: 'not found' };
  }

  async create(submission: FormSubmission) {
    this.items.push(submission);
    return ok(submission);
  }

  async update(submission: FormSubmission) {
    return this.create(submission);
  }

  async delete() {
    return ok(undefined);
  }
}

const schema: FormSchema = {
  id: 'basic',
  title: 'Basic',
  version: '1.0.0',
  sections: [
    {
      id: 's',
      title: 'S',
      order: 1,
      fields: [{ id: 'email', label: 'Email', type: 'text' }],
    },
  ],
};

describe('CreateSubmissionUseCase', () => {
  it('persists submission with visible values', async () => {
    const repo = new InMemorySubmissionRepository();
    const useCase = new CreateSubmissionUseCase(repo);

    const result = await useCase.execute({
      schema,
      values: { email: 'a@b.com' },
      visibleFieldIds: new Set(['email']),
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.schemaId).toBe('basic');
      expect(result.data.values.email).toBe('a@b.com');
      expect(repo.items).toHaveLength(1);
    }
  });
});
