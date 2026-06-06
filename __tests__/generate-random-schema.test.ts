import type { FormSchema } from '../src/domain';
import type { ISchemaRepository } from '../src/domain/repositories/schema-repository';
import { GenerateRandomSchemaUseCase } from '../src/domain/use-cases/generate-random-schema';
import { ok } from '../src/shared/types/result';

class InMemorySchemaRepository implements ISchemaRepository {
  items: FormSchema[] = [];

  async getById(id: string) {
    const found = this.items.find(item => item.id === id);
    return found ? ok(found) : { success: false as const, error: 'missing' };
  }

  async getAll() {
    return ok([...this.items]);
  }

  async save(schema: FormSchema) {
    const index = this.items.findIndex(item => item.id === schema.id);
    if (index >= 0) {
      this.items[index] = schema;
    } else {
      this.items.push(schema);
    }
    return ok(schema);
  }
}

describe('GenerateRandomSchemaUseCase', () => {
  it('generates and persists a random schema', async () => {
    const repo = new InMemorySchemaRepository();
    const useCase = new GenerateRandomSchemaUseCase(repo);

    const result = await useCase.execute({ seed: 7 });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.id).toMatch(/^random-form-/);
      expect(repo.items).toHaveLength(1);
    }
  });
});
