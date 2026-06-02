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

## Upcoming
- `FormListScreen` — submitted forms list (Phase 7)
- `FormDetailsScreen` — submission details + edit entry (Phase 7)
- Visibility engine wired into renderer (Phase 4)
- File/image field components (Phase 5)
