import type { FormSchema } from '../entities/schema/form-schema';
import type { Result } from '../../shared/types/result';

export interface ISchemaRepository {
  getById(schemaId: string): Promise<Result<FormSchema>>;
  getAll(): Promise<Result<FormSchema[]>>;
  save(schema: FormSchema): Promise<Result<FormSchema>>;
}
