import type { ISchemaRepository } from '../../domain/repositories/schema-repository';
import type { ISubmissionRepository } from '../../domain/repositories/submission-repository';
import type { IRuleEvaluator } from '../../domain/services/rule-evaluator';
import { RuleEvaluator } from '../../domain/services/rule-evaluator';
import type { IValidationEngine } from '../../domain/services/validation-engine';
import { ValidationEngine } from '../../domain/services/validation-engine';
import type { IVisibilityEngine } from '../../domain/services/visibility-engine';
import { VisibilityEngine } from '../../domain/services/visibility-engine';
import type { IFileCacheService } from '../../domain/services/file-cache-service';
import { CreateSubmissionUseCase } from '../../domain/use-cases/create-submission';
import { InMemorySchemaRepository } from '../../data/repositories/in-memory-schema-repository';
import { LocalSubmissionRepository } from '../../data/repositories/local-submission-repository';
import { FileCacheServiceImpl } from '../storage/file-cache-service.impl';

import sampleBasic from '../../assets/schemas/sample-basic.form.json';
import sampleCrossSection from '../../assets/schemas/sample-cross-section.form.json';

export interface AppContainer {
  schemaRepository: ISchemaRepository;
  submissionRepository: ISubmissionRepository;
  ruleEvaluator: IRuleEvaluator;
  visibilityEngine: IVisibilityEngine;
  validationEngine: IValidationEngine;
  fileCacheService: IFileCacheService;
  createSubmissionUseCase: CreateSubmissionUseCase;
}

let container: AppContainer | null = null;

/**
 * Composition root. Wire new implementations here as phases land.
 *
 * Phase 8: register GenerateRandomSchema use case
 */
export function getAppContainer(): AppContainer {
  if (!container) {
    const ruleEvaluator = new RuleEvaluator();
    const visibilityEngine = new VisibilityEngine(ruleEvaluator);
    const fileCacheService = new FileCacheServiceImpl();
    const submissionRepository = new LocalSubmissionRepository();
    container = {
      schemaRepository: new InMemorySchemaRepository([
        sampleBasic,
        sampleCrossSection,
      ]),
      submissionRepository,
      ruleEvaluator,
      visibilityEngine,
      validationEngine: new ValidationEngine(
        ruleEvaluator,
        visibilityEngine,
      ),
      fileCacheService,
      createSubmissionUseCase: new CreateSubmissionUseCase(
        submissionRepository,
      ),
    };
  }
  return container;
}

export function resetAppContainer(): void {
  container = null;
}
