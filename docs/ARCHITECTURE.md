# Architecture

## Layers

```
presentation/     UI, navigation, view-models
domain/           entities, repository interfaces, service interfaces
data/             repository implementations, mappers
infrastructure/   DI container, platform adapters (cache, storage)
shared/           Result type, errors, constants, guards
assets/schemas/   bundled JSON form definitions
```

## Dependency rule

Dependencies point **inward**:

- `presentation` → `domain`, `infrastructure` (container only)
- `data` → `domain`, `shared`
- `infrastructure` → `data`, `domain`, `shared`
- `domain` → `shared` only (no React Native imports)

## Dependency flow (textual)

```
┌─────────────────────────────────────────────────────────────┐
│  App.tsx / Screens / Components                             │
└───────────────────────────┬─────────────────────────────────┘
                            │ uses
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  getAppContainer()  — infrastructure/di/app-container.ts  │
└───────────────────────────┬─────────────────────────────────┘
                            │ provides
          ┌─────────────────┴─────────────────┐
          ▼                                   ▼
┌──────────────────────┐          ┌──────────────────────────┐
│ ISchemaRepository    │          │ ISubmissionRepository  │
│ (domain interface)   │          │ (domain interface)     │
└──────────┬───────────┘          └────────────┬─────────────┘
           │ implemented by                     │ Phase 6+
           ▼                                    ▼
┌──────────────────────┐          ┌──────────────────────────┐
│ InMemorySchemaRepo   │          │ LocalSubmissionRepo      │
│ (data)               │          │ (data, future)           │
└──────────────────────┘          └──────────────────────────┘

Future (Phase 3–5):
  IRuleEvaluator, IFileCacheService → used by form engine / pickers
```

## Composition root

All concrete bindings are registered in `src/infrastructure/di/app-container.ts`.
Do not construct repositories inside UI components.

## Phase 1 status

| Component | Status |
|-----------|--------|
| Domain entities & interfaces | Done |
| JSON contract types | Done |
| Sample schemas | Done |
| InMemorySchemaRepository | Done |
| SubmissionRepository | Stub (Phase 6) |
| Rule evaluator / validation / visibility engines | Phase 3–4 |
| File cache service | Phase 5 |
| Presentation screens | Phase 2+ |
