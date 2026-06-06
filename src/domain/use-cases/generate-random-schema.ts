import type { FormSchema } from '../entities/schema/form-schema';
import type { ISchemaRepository } from '../repositories/schema-repository';
import {
  RandomSchemaGenerator,
  type RandomSchemaGeneratorOptions,
} from '../services/random-schema-generator';
import type { Result } from '../../shared/types/result';

export class GenerateRandomSchemaUseCase {
  constructor(
    private readonly schemaRepository: ISchemaRepository,
    private readonly generator: RandomSchemaGenerator = new RandomSchemaGenerator(),
  ) {}

  async execute(
    options?: RandomSchemaGeneratorOptions,
  ): Promise<Result<FormSchema>> {
    const schema = this.generator.generate(options);
    return this.schemaRepository.save(schema);
  }
}
