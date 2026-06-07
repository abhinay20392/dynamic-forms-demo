# Architecture

## Overview

The app renders forms entirely from JSON. Business logic lives in a **framework-agnostic domain layer**; React Native code is limited to presentation and infrastructure adapters.

**Stack:** React Native 0.85 · TypeScript · AsyncStorage · Jest

## Layers

```
presentation/     Screens, form components, hooks
domain/           Entities, use cases, engines (pure TS)
data/             Repository implementations, mappers
infrastructure/   DI container, file cache, document/image pickers
shared/           Result, errors, constants, guards, utils
assets/schemas/   Bundled JSON form definitions
```

## Dependency rule

Dependencies point **inward**:

| Layer | May depend on |
|-------|----------------|
| `presentation` | `domain`, `infrastructure` (via `getAppContainer()` only) |
| `data` | `domain`, `shared` |
| `infrastructure` | `data`, `domain`, `shared` |
| `domain` | `shared` only — **no React Native imports** |

## Composition root

`src/infrastructure/di/app-container.ts` registers:

| Binding | Implementation |
|---------|----------------|
| `ISchemaRepository` | `InMemorySchemaRepository` |
| `ISubmissionRepository` | `LocalSubmissionRepository` (AsyncStorage) |
| `IRuleEvaluator` | `RuleEvaluator` |
| `IVisibilityEngine` | `VisibilityEngine` |
| `IValidationEngine` | `ValidationEngine` |
| `IFileCacheService` | `FileCacheServiceImpl` |
| `CreateSubmissionUseCase` | — |
| `UpdateSubmissionUseCase` | — |
| `GenerateRandomSchemaUseCase` | — |

UI components must not construct engines or repositories directly.

## Form runtime pipeline

```
FormSchema (JSON)
       │
       ▼
DynamicFormView
  ├── useFormState        → centralized values
  ├── useFormVisibility   → show/hide sections & fields; clear hidden values
  ├── useFormValidation   → errors; on blur / on submit
  └── FormProvider
        └── SectionView → FieldRenderer → field components
       │
       ▼ (Submit)
ValidationEngine.validate()  — skips hidden fields/sections
       │
       ▼
CreateSubmissionUseCase  OR  UpdateSubmissionUseCase
       │
       ▼
submission-result-builder  → visible, non-empty values only
       │
       ▼
LocalSubmissionRepository  → AsyncStorage
```

## Domain engines

### RuleEvaluator

Evaluates `RuleGroup` trees: `all`, `any`, `not`, and field conditions. Used by both visibility and dynamic validation.

### VisibilityEngine

- Section visible when `section.visibility` passes (or absent).
- Field visible when section is visible **and** `field.visibility` passes.
- Hidden fields excluded from validation.

### ValidationEngine

- Static and dynamic (`when`) field rules.
- Implicit `required` from `field.required`.
- Section-level `validation` gates.
- Skips hidden sections/fields when visibility engine is injected.

## Navigation (App.tsx)

| Route | Screen |
|-------|--------|
| `list` | `SchemaListScreen` |
| `submissions` | `SubmissionListScreen` |
| `submissionDetails` | `FormDetailsScreen` |
| `form` | `DynamicFormScreen` (create) |
| `formEdit` | `DynamicFormScreen` (edit) |

## Infrastructure adapters

| Adapter | Package | Role |
|---------|---------|------|
| Document picker | `@react-native-documents/picker` | Folder/file selection |
| Image picker | `react-native-image-picker` | Gallery + camera |
| File cache | `react-native-blob-util` | Copy to `CacheDir/dynamic-forms/` |

## Key presentation modules

| Module | Role |
|--------|------|
| `useFormState` | Values, reset, batch set |
| `useFormVisibility` | Visibility snapshot + hidden value clear policy |
| `useFormValidation` | Touch tracking, submit validation, error display |
| `useAttachmentField` | Pick → cache → set attachment value |
| `FieldRenderer` | Type → component registry |

## Test strategy

| Layer | Test location | Examples |
|-------|---------------|----------|
| Engines | `__tests__/rule-evaluator.test.ts`, etc. | Condition trees, validation skip |
| Use cases | `__tests__/create-submission.test.ts`, etc. | Create/update persistence |
| Integration | `__tests__/form-flow.integration.test.ts` | Validate → save → update |
| Guards | `__tests__/schema-guards.test.ts` | Schema load validation |

**44 tests** across **17 suites**.

## Module status

All planned modules are **complete** (Phases 1–9).

## Related docs

- [JSON_SCHEMA.md](JSON_SCHEMA.md) — contract reference
- [EXTENDING.md](EXTENDING.md) — add fields, rules, use cases
- [CONSTRAINTS.md](CONSTRAINTS.md) — limitations and assumptions
