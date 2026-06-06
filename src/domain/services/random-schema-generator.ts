import type { FormSchema } from '../entities/schema/form-schema';
import type { FieldSchema } from '../entities/schema/fields';
import type { SectionSchema } from '../entities/schema/sections';
import type { RuleGroup } from '../entities/schema/rules';
import { FORM_SCHEMA_VERSION } from '../../shared/constants/form';
import { assertFormSchema } from '../../shared/utils/schema-guards';
import { createRandom, type SeededRandom } from '../../shared/utils/random';

export interface RandomSchemaGeneratorOptions {
  seed?: number;
}

const FORM_TITLES = [
  'Random Registration',
  'Dynamic Application',
  'Generated Intake Form',
  'Demo Survey Form',
];

const INTEREST_OPTIONS = [
  { label: 'Technology', value: 'tech' },
  { label: 'Sports', value: 'sports' },
  { label: 'Music', value: 'music' },
  { label: 'Travel', value: 'travel' },
];

function condition(field: string, op: 'equals' | 'isNotEmpty' | 'notEquals', value?: string) {
  return value === undefined
    ? { field, op }
    : { field, op, value };
}

function all(expressions: NonNullable<RuleGroup['all']>): RuleGroup {
  return { all: expressions };
}

function any(expressions: NonNullable<RuleGroup['any']>): RuleGroup {
  return { any: expressions };
}

/** Ensures rule field refs exist and only point to same-or-earlier sections (no cycles). */
export function validateGeneratedSchemaReferences(schema: FormSchema): void {
  const fieldSectionOrder = new Map<string, number>();
  for (const section of schema.sections) {
    for (const field of section.fields) {
      fieldSectionOrder.set(field.id, section.order);
    }
  }

  const visitRule = (rule: RuleGroup | undefined, maxSectionOrder: number) => {
    if (!rule) {
      return;
    }
    if (rule.all) {
      for (const expr of rule.all) {
        visitExpression(expr, maxSectionOrder);
      }
    }
    if (rule.any) {
      for (const expr of rule.any) {
        visitExpression(expr, maxSectionOrder);
      }
    }
    if (rule.not) {
      visitExpression(rule.not, maxSectionOrder);
    }
  };

  const visitExpression = (expr: unknown, maxSectionOrder: number) => {
    if (!expr || typeof expr !== 'object') {
      return;
    }
    if ('field' in expr && typeof (expr as { field: string }).field === 'string') {
      const ref = (expr as { field: string }).field;
      const refOrder = fieldSectionOrder.get(ref);
      if (refOrder === undefined) {
        throw new Error(`Invalid rule reference: ${ref}`);
      }
      if (refOrder > maxSectionOrder) {
        throw new Error(`Forward rule reference: ${ref}`);
      }
      return;
    }
    visitRule(expr as RuleGroup, maxSectionOrder);
  };

  for (const section of schema.sections) {
    visitRule(section.visibility, section.order);
    visitRule(section.validation, section.order);
    for (const field of section.fields) {
      visitRule(field.visibility, section.order);
      for (const rule of field.validation ?? []) {
        if ('when' in rule) {
          visitRule(rule.when, section.order);
        }
      }
    }
  }
}

export class RandomSchemaGenerator {
  generate(options: RandomSchemaGeneratorOptions = {}): FormSchema {
    const rng = createRandom(options.seed);
    const schema = this.buildSchema(rng);
    assertFormSchema(schema);
    validateGeneratedSchemaReferences(schema);
    return schema;
  }

  private buildSchema(rng: SeededRandom): FormSchema {
    const suffix = rng.int(1000, 9999);
    const modeFieldId = 'applicationMode';
    const nameFieldId = 'applicantName';
    const countryFieldId = 'countryCode';

    const sections: SectionSchema[] = [
      this.buildBasicsSection(rng, modeFieldId, nameFieldId, countryFieldId),
    ];

    if (rng.bool(0.85)) {
      sections.push(
        this.buildBusinessSection(rng, modeFieldId, countryFieldId),
      );
    }

    if (rng.bool(0.8)) {
      sections.push(
        this.buildDocumentsSection(rng, modeFieldId, nameFieldId),
      );
    }

    return {
      id: `random-form-${suffix}`,
      title: rng.pick(FORM_TITLES),
      version: FORM_SCHEMA_VERSION,
      description:
        'Auto-generated demo form with random sections, validation, and visibility rules.',
      hiddenValuePolicy: 'clear',
      sections,
    };
  }

  private buildBasicsSection(
    rng: SeededRandom,
    modeFieldId: string,
    nameFieldId: string,
    countryFieldId: string,
  ): SectionSchema {
    const fields: FieldSchema[] = [
      {
        id: nameFieldId,
        label: 'Applicant Name',
        type: 'text',
        order: 1,
        required: true,
        placeholder: 'Enter full name',
        validation: [
          { type: 'required', message: 'Name is required' },
          { type: 'minLength', value: 2, message: 'At least 2 characters' },
        ],
      },
      {
        id: modeFieldId,
        label: 'Application Mode',
        type: 'radio',
        order: 2,
        required: true,
        options: [
          { label: 'Personal', value: 'personal' },
          { label: 'Business', value: 'business' },
          { label: 'Student', value: 'student' },
        ],
      },
      {
        id: countryFieldId,
        label: 'Country Code',
        type: 'text',
        order: 3,
        required: true,
        placeholder: 'e.g. IN, US',
      },
    ];

    if (rng.bool(0.7)) {
      const shuffled = [...INTEREST_OPTIONS].sort(() => rng.next() - 0.5);
      const optionCount = rng.int(2, Math.min(4, shuffled.length));
      fields.push({
        id: 'interests',
        label: 'Interests',
        type: 'checkbox',
        order: 4,
        options: shuffled.slice(0, optionCount),
        validation: [
          { type: 'minSelections', value: 1, message: 'Pick at least one' },
          {
            type: 'maxSelections',
            value: optionCount,
            message: `Pick up to ${optionCount}`,
          },
        ],
      });
    }

    return {
      id: 'basics',
      title: 'Basics',
      order: 1,
      description: 'Always visible — guarantees at least one submittable path.',
      fields,
    };
  }

  private buildBusinessSection(
    rng: SeededRandom,
    modeFieldId: string,
    countryFieldId: string,
  ): SectionSchema {
    const businessNameId = 'businessName';

    return {
      id: 'business',
      title: 'Business Details',
      order: 2,
      visibility: all([
        condition(modeFieldId, 'equals', 'business'),
        condition(countryFieldId, 'equals', 'IN'),
      ]),
      fields: [
        {
          id: businessNameId,
          label: 'Business Name',
          type: 'text',
          order: 1,
          validation: [
            {
              type: 'required',
              message: 'Business name required for business mode in India',
              when: all([
                condition(modeFieldId, 'equals', 'business'),
                condition(countryFieldId, 'equals', 'IN'),
              ]),
            },
          ],
        },
        {
          id: 'taxId',
          label: 'Tax ID',
          type: 'text',
          order: 2,
          visibility: all([
            condition(modeFieldId, 'equals', 'business'),
            condition(businessNameId, 'isNotEmpty'),
          ]),
        },
        ...(rng.bool(0.5)
          ? [
              {
                id: 'businessType',
                label: 'Business Type',
                type: 'radio' as const,
                order: 3,
                options: [
                  { label: 'Retail', value: 'retail' },
                  { label: 'Services', value: 'services' },
                ],
              },
            ]
          : []),
      ],
    };
  }

  private buildDocumentsSection(
    rng: SeededRandom,
    modeFieldId: string,
    nameFieldId: string,
  ): SectionSchema {
    return {
      id: 'documents',
      title: 'Documents',
      order: 3,
      visibility: any([
        condition(modeFieldId, 'equals', 'personal'),
        all([
          condition(modeFieldId, 'equals', 'business'),
          condition(nameFieldId, 'isNotEmpty'),
        ]),
      ]),
      validation: all([condition(modeFieldId, 'notEquals', 'student')]),
      fields: [
        {
          id: 'supportingDoc',
          label: 'Supporting Document (PDF)',
          type: 'file',
          order: 1,
          allowedMimeTypes: ['application/pdf'],
          validation: [
            { type: 'required', message: 'Document is required' },
            {
              type: 'allowedMimeTypes',
              value: ['application/pdf'],
              message: 'Only PDF files allowed',
            },
          ],
        },
        {
          id: 'profilePhoto',
          label: 'Profile Photo',
          type: 'image',
          order: 2,
          allowCamera: true,
          allowGallery: true,
          validation: [
            {
              type: 'required',
              message: 'Photo required for personal applications',
              when: all([
                condition(modeFieldId, 'equals', 'personal'),
                condition(nameFieldId, 'isNotEmpty'),
              ]),
            },
          ],
        },
        ...(rng.bool(0.4)
          ? [
              {
                id: 'notes',
                label: 'Additional Notes',
                type: 'text' as const,
                order: 4,
                maxLength: 200,
              },
            ]
          : []),
      ],
    };
  }
}

export function generateRandomFormSchema(
  options?: RandomSchemaGeneratorOptions,
): FormSchema {
  return new RandomSchemaGenerator().generate(options);
}
