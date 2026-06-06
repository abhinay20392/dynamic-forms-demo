import type { FormSchema } from '../src/domain';
import type { FormSubmission } from '../src/domain/entities/submission/form-submission';
import type { ISubmissionRepository } from '../src/domain/repositories/submission-repository';
import { UpdateSubmissionUseCase } from '../src/domain/use-cases/update-submission';
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
    const index = this.items.findIndex(item => item.id === submission.id);
    if (index >= 0) {
      this.items[index] = submission;
    }
    return ok(submission);
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
      fields: [{ id: 'name', label: 'Name', type: 'text' }],
    },
  ],
};

const existing: FormSubmission = {
  id: 'sub-1',
  schemaId: 'basic',
  schemaVersion: '1.0.0',
  title: 'Basic',
  values: { name: 'Old' },
  createdAt: '2026-06-01T10:00:00.000Z',
};

describe('UpdateSubmissionUseCase', () => {
  it('updates values and preserves id and createdAt', async () => {
    const repo = new InMemorySubmissionRepository();
    repo.items.push(existing);
    const useCase = new UpdateSubmissionUseCase(repo);

    const result = await useCase.execute({
      existing,
      schema,
      values: { name: 'New Name' },
      visibleFieldIds: new Set(['name']),
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.id).toBe('sub-1');
      expect(result.data.createdAt).toBe('2026-06-01T10:00:00.000Z');
      expect(result.data.values.name).toBe('New Name');
      expect(result.data.updatedAt).toBeDefined();
    }
  });
});
