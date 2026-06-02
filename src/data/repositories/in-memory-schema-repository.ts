import type { FormSchema } from '../../domain/entities/schema/form-schema';
import type { ISchemaRepository } from '../../domain/repositories/schema-repository';
import { err, ok, type Result } from '../../shared/types/result';
import { mapJsonToFormSchema } from '../mappers/form-schema-mapper';
import { assertFormSchema } from '../../shared/utils/schema-guards';

export class InMemorySchemaRepository implements ISchemaRepository {
  private readonly schemas = new Map<string, FormSchema>();

  constructor(initialSchemas: unknown[] = []) {
    for (const raw of initialSchemas) {
      assertFormSchema(raw);
      const schema = mapJsonToFormSchema(raw);
      this.schemas.set(schema.id, schema);
    }
  }

  async getById(schemaId: string): Promise<Result<FormSchema>> {
    const schema = this.schemas.get(schemaId);
    if (!schema) {
      return err(`Schema not found: ${schemaId}`);
    }
    return ok(schema);
  }

  async getAll(): Promise<Result<FormSchema[]>> {
    return ok([...this.schemas.values()]);
  }

  async save(schema: FormSchema): Promise<Result<FormSchema>> {
    assertFormSchema(schema);
    this.schemas.set(schema.id, schema);
    return ok(schema);
  }
}
