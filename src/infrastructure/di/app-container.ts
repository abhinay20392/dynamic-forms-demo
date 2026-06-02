import type { ISchemaRepository } from '../../domain/repositories/schema-repository';
import type { ISubmissionRepository } from '../../domain/repositories/submission-repository';
import { InMemorySchemaRepository } from '../../data/repositories/in-memory-schema-repository';
import { SubmissionRepositoryStub } from '../../data/repositories/submission-repository.stub';

import sampleBasic from '../../assets/schemas/sample-basic.form.json';
import sampleCrossSection from '../../assets/schemas/sample-cross-section.form.json';

export interface AppContainer {
  schemaRepository: ISchemaRepository;
  submissionRepository: ISubmissionRepository;
}

let container: AppContainer | null = null;

/**
 * Composition root. Wire new implementations here as phases land.
 *
 * Phase 2+: presentation hooks / screens
 * Phase 3–4: ruleEvaluator, validationEngine, visibilityEngine
 * Phase 5: fileCacheService
 * Phase 6: replace SubmissionRepositoryStub with LocalSubmissionRepository
 * Phase 8: register GenerateRandomSchema use case
 */
export function getAppContainer(): AppContainer {
  if (!container) {
    container = {
      schemaRepository: new InMemorySchemaRepository([
        sampleBasic,
        sampleCrossSection,
      ]),
      submissionRepository: new SubmissionRepositoryStub(),
    };
  }
  return container;
}

export function resetAppContainer(): void {
  container = null;
}
