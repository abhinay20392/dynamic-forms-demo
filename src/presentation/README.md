# Presentation layer

## Phase 2 (done)
- `screens/SchemaListScreen` — pick a bundled schema
- `screens/DynamicFormScreen` — full-screen dynamic form
- `components/forms/*` — field registry (text, radio, checkbox)
- `forms/hooks/useFormState` — centralized form values
- `forms/context/FormContext` — field components read/write state

## Phase 3 (done)
- `domain/services/rule-evaluator.ts` — `all` / `any` / `not` condition trees
- `domain/services/validation-engine.ts` — static + dynamic field rules, section rules
- `forms/hooks/useFormValidation.ts` — on blur, on change (when touched), on submit
- Field error UI + section error banner on submit

## Phase 4 (done)
- `domain/services/visibility-engine.ts` — section/field visibility from rules
- `forms/hooks/useFormVisibility.ts` — live updates + `clear` hidden values
- Validation skips hidden sections/fields

## Phase 5 (done)
- `FilePickerField` — document picker (folder), cached path in form state
- `ImagePickerField` — gallery/folder + camera
- `FileCacheServiceImpl` — copies assets to `CacheDir/dynamic-forms/`

## Phase 6 (done)
- `CreateSubmissionUseCase` + `submission-result-builder`
- `LocalSubmissionRepository` (AsyncStorage)
- Submit saves normalized JSON; preview shows saved result

## Phase 7 (done)
- `SubmissionListScreen` — all saved submissions
- `FormDetailsScreen` — sectioned details, JSON, image preview, Edit
- Edit mode prefills values (including attachments) and `UpdateSubmissionUseCase`

## Phase 8 (done)
- `RandomSchemaGenerator` + `GenerateRandomSchemaUseCase`
- Home screen **Generate random form** button → saves schema and opens it
- Guardrails: acyclic rule refs, always-visible required basics section

## Upcoming
- File/image field components (Phase 5)
