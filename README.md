# Dynamic Forms Demo

A production-style **React Native** reference app for building **JSON-driven dynamic forms** with **clean architecture**. Define entire forms—including sections, validation, visibility, and file uploads—in JSON. No hardcoded screens per form.

Built with **React Native 0.85**, **TypeScript**, and a fully testable domain layer.

## Highlights

| Capability | Details |
|------------|---------|
| **JSON-driven UI** | Text, radio, checkbox, file, and image fields across multiple sections |
| **Validation** | Static + dynamic rules; conditional `required`, pattern, min/max, MIME types |
| **Visibility** | Cross-section rules with `all` (AND), `any` (OR), `not` |
| **Attachments** | Document picker + camera/gallery; files copied to app cache |
| **Submissions** | Save, list, view details, and edit with normalized result JSON |
| **Demo utility** | One-tap random form generator with safety guardrails |
| **Architecture** | Domain / data / infrastructure / presentation separation |
| **Tests** | 44 tests — unit + integration |

## Tech stack

- React Native **0.85.3** · React **19** · TypeScript **5.8**
- `@react-native-documents/picker` — file picker (Android/iOS)
- `react-native-image-picker` — gallery + camera
- `react-native-blob-util` — cache directory persistence
- `@react-native-async-storage/async-storage` — local submission storage
- Jest — domain and flow tests

## Quick start

**Prerequisites:** Node ≥ 22, React Native environment ([setup guide](https://reactnative.dev/docs/set-up-your-environment))

```sh
npm install
npm start
```

**Android**

```sh
npm run android
```

**iOS** (first run or after native dep changes)

```sh
cd ios && bundle exec pod install && cd ..
npm run ios
```

## App flows

```
Home (schema list)
  ├── Open bundled form → fill → validate → submit → saved JSON
  ├── Generate random form → auto-opens generated schema
  └── View submitted forms
        └── Submission list → details (sections + JSON + image preview)
              └── Edit → save changes → back to refreshed details
```

## Project structure

```
src/
├── domain/              Entities, use cases, engines (pure TypeScript)
│   ├── entities/        FormSchema, submissions, validation types
│   ├── services/        RuleEvaluator, ValidationEngine, VisibilityEngine, …
│   └── use-cases/       CreateSubmission, UpdateSubmission, GenerateRandomSchema
├── data/                Repository implementations
├── infrastructure/      DI container, file cache, picker adapters
├── presentation/        Screens, form components, hooks
├── shared/              Result type, guards, constants, utils
└── assets/schemas/      Bundled JSON form definitions

docs/                    Architecture, schema contract, extending guide
__tests__/               17 test suites (44 tests)
```

## Screens

| Screen | Purpose |
|--------|---------|
| `SchemaListScreen` | Pick a form, generate random schema, open submissions |
| `DynamicFormScreen` | Create or edit a form (schema-driven) |
| `SubmissionListScreen` | All locally saved submissions |
| `FormDetailsScreen` | Sectioned read-only view, full JSON, edit entry |

## Documentation

| Document | Description |
|----------|-------------|
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | Layers, dependency flow, runtime pipeline |
| [JSON_SCHEMA.md](docs/JSON_SCHEMA.md) | Form JSON contract, rules, examples |
| [EXTENDING.md](docs/EXTENDING.md) | Add field types, validation rules, use cases |
| [CONSTRAINTS.md](docs/CONSTRAINTS.md) | Assumptions, platform notes, limitations |
| [DYNAMIC_FORMS_PHASE_PLAN.md](DYNAMIC_FORMS_PHASE_PLAN.md) | 9-phase development history |
| [LINKEDIN_POST.md](docs/LINKEDIN_POST.md) | Shareable project announcement |

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Metro bundler |
| `npm run android` | Run on Android |
| `npm run ios` | Run on iOS |
| `npm test` | Run all Jest tests |
| `npm run lint` | ESLint |

## Tests

```sh
npm test
```

Coverage includes:

- Rule evaluator (`all` / `any` / `not`)
- Validation and visibility engines
- Submission result builder and create/update use cases
- Schema guards and random form generator
- End-to-end form flow integration tests

## Sample JSON schemas

| File | Demonstrates |
|------|----------------|
| `src/assets/schemas/sample-basic.form.json` | Multi-section form, static validation, radio/checkbox |
| `src/assets/schemas/sample-cross-section.form.json` | Cross-section visibility, dynamic validation, file/image |

## Submission JSON shape

Submissions store **visible, non-empty** field values. Attachments include a stable **cache path**:

```json
{
  "id": "sub-1738...",
  "schemaId": "sample-cross-section",
  "schemaVersion": "1.0.0",
  "title": "Employment & Documents",
  "values": {
    "fullName": "Jane Doe",
    "resumeFile": {
      "cachedPath": "/.../Cache/dynamic-forms/1234567890-resume.pdf",
      "originalName": "resume.pdf",
      "mimeType": "application/pdf",
      "sizeBytes": 102400,
      "source": "file-picker"
    }
  },
  "createdAt": "2026-06-02T10:00:00.000Z",
  "updatedAt": "2026-06-02T11:00:00.000Z"
}
```

## Adding a new form

1. Add JSON under `src/assets/schemas/`.
2. Register in `src/infrastructure/di/app-container.ts`.
3. Schema is validated at load via `assertFormSchema`.

Or use **Generate random form** on the home screen for instant demo schemas.

## License

Private demo project.
