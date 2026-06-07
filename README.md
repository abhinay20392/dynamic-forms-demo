# Dynamic Forms Demo

React Native demo app for **JSON-driven dynamic forms** with clean architecture.

## Features

- Forms generated from JSON schema (sections, text, radio, checkbox, file, image)
- Normal + dynamic validation with intersection rules (`all` / `any` / `not`)
- Dynamic section/field visibility across sections
- File/image pickers with cache persistence
- Save submissions as JSON (AsyncStorage)
- Submitted forms list, details, and edit mode
- Random form generator for demo

## Quick start

```sh
npm install
npm start
```

**Android**

```sh
npm run android
```

**iOS**

```sh
cd ios && bundle exec pod install && cd ..
npm run ios
```

## Project structure

```
src/
  domain/           entities, use cases, engines
  data/             repositories
  infrastructure/   DI, file cache, pickers
  presentation/     screens, form components, hooks
  assets/schemas/   bundled JSON forms
docs/               architecture and schema docs
```

## Documentation

| Doc | Description |
|-----|-------------|
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | Layers, dependency flow, module status |
| [JSON_SCHEMA.md](docs/JSON_SCHEMA.md) | Form JSON contract and examples |
| [EXTENDING.md](docs/EXTENDING.md) | Add field types, rules, use cases |
| [CONSTRAINTS.md](docs/CONSTRAINTS.md) | Assumptions and limitations |
| [DYNAMIC_FORMS_PHASE_PLAN.md](DYNAMIC_FORMS_PHASE_PLAN.md) | Phase-wise development plan |

## Tests

```sh
npm test
```

Covers validation, visibility, submission mapping, schema guards, random generator, and integration flows.

## Demo flows

1. **Home** — pick a bundled form or tap **Generate random form**
2. **Fill & submit** — validation runs; result JSON saved locally
3. **View submitted forms** — list → details → edit → save changes

## Sample schemas

- `src/assets/schemas/sample-basic.form.json`
- `src/assets/schemas/sample-cross-section.form.json`
