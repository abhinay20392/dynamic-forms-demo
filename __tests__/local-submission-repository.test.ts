import { LocalSubmissionRepository } from '../src/data/repositories/local-submission-repository';
import type { FormSubmission } from '../src/domain/entities/submission/form-submission';

const sample: FormSubmission = {
  id: 'sub-1',
  schemaId: 'basic',
  schemaVersion: '1.0.0',
  title: 'Basic',
  values: { email: 'test@example.com' },
  createdAt: '2026-06-02T10:00:00.000Z',
};

describe('LocalSubmissionRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates and lists submissions', async () => {
    const repo = new LocalSubmissionRepository();
    const createResult = await repo.create(sample);
    expect(createResult.success).toBe(true);

    const listResult = await repo.list();
    expect(listResult.success).toBe(true);
    if (listResult.success) {
      expect(listResult.data).toHaveLength(1);
      expect(listResult.data[0].id).toBe('sub-1');
    }
  });

  it('gets submission by id', async () => {
    const repo = new LocalSubmissionRepository();
    await repo.create(sample);

    const getResult = await repo.getById('sub-1');
    expect(getResult.success).toBe(true);
    if (getResult.success) {
      expect(getResult.data.values.email).toBe('test@example.com');
    }
  });
});
