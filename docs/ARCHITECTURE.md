# Architecture

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

- `presentation` → `domain`, `infrastructure` (container only)
- `data` → `domain`, `shared`
- `infrastructure` → `data`, `domain`, `shared`
- `domain` → `shared` only (no React Native imports)

## Dependency flow

```
App.tsx / Screens
       │
       ▼
getAppContainer()  ──►  use cases, repositories, engines
       │
       ├── ISchemaRepository        → InMemorySchemaRepository
       ├── ISubmissionRepository    → LocalSubmissionRepository (AsyncStorage)
       ├── IRuleEvaluator           → RuleEvaluator
       ├── IVisibilityEngine        → VisibilityEngine
       ├── IValidationEngine        → ValidationEngine
       ├── IFileCacheService        → FileCacheServiceImpl
       ├── CreateSubmissionUseCase
       ├── UpdateSubmissionUseCase
       └── GenerateRandomSchemaUseCase
```

## Form runtime pipeline

```
JSON Schema
    → DynamicFormView
        → useFormState (values)
        → useFormVisibility (show/hide, clear hidden)
        → useFormValidation (errors, submit gate)
        → FieldRenderer → field components
    → Submit
        → ValidationEngine.validate()
        → CreateSubmissionUseCase / UpdateSubmissionUseCase
        → LocalSubmissionRepository
```

## Screens

| Screen | Route purpose |
|--------|----------------|
| `SchemaListScreen` | Pick form / generate random / view submissions |
| `DynamicFormScreen` | Create or edit form |
| `SubmissionListScreen` | All saved submissions |
| `FormDetailsScreen` | Read-only details + edit entry |

## Module status (complete)

| Component | Status |
|-----------|--------|
| Domain entities & JSON contract | Done |
| Dynamic renderer (sections + fields) | Done |
| Rule evaluator | Done |
| Validation engine | Done |
| Visibility engine | Done |
| File cache + pickers | Done |
| Submission save/update | Done |
| List / details / edit | Done |
| Random schema generator | Done |
| Tests + docs | Done |

## Composition root

All bindings live in `src/infrastructure/di/app-container.ts`. UI must not construct repositories or engines directly except via `getAppContainer()`.
