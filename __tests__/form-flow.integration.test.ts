import type { FormSchema } from '../src/domain';
import { RuleEvaluator } from '../src/domain/services/rule-evaluator';
import { ValidationEngine } from '../src/domain/services/validation-engine';
import { VisibilityEngine } from '../src/domain/services/visibility-engine';
import { CreateSubmissionUseCase } from '../src/domain/use-cases/create-submission';
import { UpdateSubmissionUseCase } from '../src/domain/use-cases/update-submission';
import type { ISubmissionRepository } from '../src/domain/repositories/submission-repository';
import type { FormSubmission } from '../src/domain/entities/submission/form-submission';
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
    return found ? ok(found) : { success: false as const, error: 'missing' };
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

const crossSectionSchema: FormSchema = {
  id: 'integration-cross',
  title: 'Integration Cross Section',
  version: '1.0.0',
  hiddenValuePolicy: 'clear',
  sections: [
    {
      id: 'employment',
      title: 'Employment',
      order: 1,
      fields: [
        {
          id: 'employmentType',
          label: 'Type',
          type: 'radio',
          required: true,
          options: [
            { label: 'Employed', value: 'employed' },
            { label: 'Student', value: 'student' },
          ],
        },
        {
          id: 'country',
          label: 'Country',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      id: 'business',
      title: 'Business',
      order: 2,
      visibility: {
        all: [
          { field: 'employmentType', op: 'equals', value: 'self_employed' },
          { field: 'country', op: 'equals', value: 'IN' },
        ],
      },
      fields: [
        {
          id: 'businessName',
          label: 'Business Name',
          type: 'text',
          validation: [
            {
              type: 'required',
              when: {
                all: [
                  { field: 'employmentType', op: 'equals', value: 'self_employed' },
                  { field: 'country', op: 'equals', value: 'IN' },
                ],
              },
            },
          ],
        },
      ],
    },
    {
      id: 'documents',
      title: 'Documents',
      order: 3,
      visibility: {
        any: [{ field: 'employmentType', op: 'equals', value: 'employed' }],
      },
      fields: [
        {
          id: 'resumeFile',
          label: 'Resume',
          type: 'file',
          validation: [{ type: 'required' }],
        },
      ],
    },
  ],
};

function createEngines() {
  const ruleEvaluator = new RuleEvaluator();
  const visibilityEngine = new VisibilityEngine(ruleEvaluator);
  const validationEngine = new ValidationEngine(
    ruleEvaluator,
    visibilityEngine,
  );
  return { ruleEvaluator, visibilityEngine, validationEngine };
}

describe('form flow integration', () => {
  it('creates submission when validation passes for visible fields', async () => {
    const { visibilityEngine, validationEngine } = createEngines();
    const repo = new InMemorySubmissionRepository();
    const createUseCase = new CreateSubmissionUseCase(repo);

    const values = {
      employmentType: 'employed',
      country: 'US',
      resumeFile: {
        cachedPath: '/cache/resume.pdf',
        originalName: 'resume.pdf',
        mimeType: 'application/pdf',
        sizeBytes: 1000,
        source: 'file-picker' as const,
      },
    };

    const visibility = visibilityEngine.resolve(crossSectionSchema, values);
    const validation = validationEngine.validate(crossSectionSchema, values);

    expect(validation.isValid).toBe(true);
    expect(visibility.hiddenFieldIds.has('businessName')).toBe(true);

    const result = await createUseCase.execute({
      schema: crossSectionSchema,
      values,
      visibleFieldIds: visibility.visibleFieldIds,
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.values.businessName).toBeUndefined();
      expect(result.data.values.resumeFile).toBeDefined();
    }
  });

  it('blocks submission when visible required file is missing', () => {
    const { visibilityEngine, validationEngine } = createEngines();
    const values = {
      employmentType: 'employed',
      country: 'US',
    };

    const visibility = visibilityEngine.resolve(crossSectionSchema, values);
    const validation = validationEngine.validate(crossSectionSchema, values);

    expect(visibility.visibleFieldIds.has('resumeFile')).toBe(true);
    expect(validation.isValid).toBe(false);
    expect(validation.fieldErrors.some(e => e.fieldId === 'resumeFile')).toBe(
      true,
    );
  });

  it('updates submission while preserving id and createdAt', async () => {
    const { visibilityEngine, validationEngine } = createEngines();
    const repo = new InMemorySubmissionRepository();
    const createUseCase = new CreateSubmissionUseCase(repo);
    const updateUseCase = new UpdateSubmissionUseCase(repo);

    const initialValues = {
      employmentType: 'student',
      country: 'IN',
    };
    const visibility = visibilityEngine.resolve(
      crossSectionSchema,
      initialValues,
    );
    expect(validationEngine.validate(crossSectionSchema, initialValues).isValid).toBe(
      true,
    );

    const created = await createUseCase.execute({
      schema: crossSectionSchema,
      values: initialValues,
      visibleFieldIds: visibility.visibleFieldIds,
    });
    expect(created.success).toBe(true);
    if (!created.success) {
      return;
    }

    const updatedValues = {
      ...initialValues,
      country: 'US',
    };
    const updatedVisibility = visibilityEngine.resolve(
      crossSectionSchema,
      updatedValues,
    );

    const updated = await updateUseCase.execute({
      existing: created.data,
      schema: crossSectionSchema,
      values: updatedValues,
      visibleFieldIds: updatedVisibility.visibleFieldIds,
    });

    expect(updated.success).toBe(true);
    if (updated.success) {
      expect(updated.data.id).toBe(created.data.id);
      expect(updated.data.createdAt).toBe(created.data.createdAt);
      expect(updated.data.values.country).toBe('US');
      expect(updated.data.updatedAt).toBeDefined();
    }
  });
});
