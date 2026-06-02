import type { ISchemaRepository } from '../../domain/repositories/schema-repository';
import type { ISubmissionRepository } from '../../domain/repositories/submission-repository';
import type { IRuleEvaluator } from '../../domain/services/rule-evaluator';
import { RuleEvaluator } from '../../domain/services/rule-evaluator';
import type { IValidationEngine } from '../../domain/services/validation-engine';
import { ValidationEngine } from '../../domain/services/validation-engine';
import { InMemorySchemaRepository } from '../../data/repositories/in-memory-schema-repository';
import { SubmissionRepositoryStub } from '../../data/repositories/submission-repository.stub';

import sampleBasic from '../../assets/schemas/sample-basic.form.json';
import sampleCrossSection from '../../assets/schemas/sample-cross-section.form.json';

export interface AppContainer {
  schemaRepository: ISchemaRepository;
  submissionRepository: ISubmissionRepository;
  ruleEvaluator: IRuleEvaluator;
  validationEngine: IValidationEngine;
}

let container: AppContainer | null = null;

/**
 * Composition root. Wire new implementations here as phases land.
 *
 * Phase 2+: presentation hooks / screens
 * Phase 4: visibilityEngine
 * Phase 5: fileCacheService
 * Phase 6: replace SubmissionRepositoryStub with LocalSubmissionRepository
 * Phase 8: register GenerateRandomSchema use case
 */
export function getAppContainer(): AppContainer {
  if (!container) {
    const ruleEvaluator = new RuleEvaluator();
    container = {
      schemaRepository: new InMemorySchemaRepository([
        sampleBasic,
        sampleCrossSection,
      ]),
      submissionRepository: new SubmissionRepositoryStub(),
      ruleEvaluator,
      validationEngine: new ValidationEngine(ruleEvaluator),
    };
  }
  return container;
}

export function resetAppContainer(): void {
  container = null;
}
