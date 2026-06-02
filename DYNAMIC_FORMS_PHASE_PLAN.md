# Dynamic Forms Demo - Phase-wise Development Plan

## Goal
Build a React Native demo app where forms are generated from JSON and support:
- multiple sections
- text input, radio group, checkbox multiselect, file picker, image picker (gallery/folder + camera)
- normal validation + dynamic validation
- dynamic visibility with intersection logic
- save submission as JSON with cached file/image paths
- list submitted forms, details screen, and edit mode
- random form generation for demo

## Core Principles
- Clean architecture separation (`presentation`, `domain`, `data`, `infrastructure`, `shared`)
- JSON-driven behavior (rendering, validation, visibility)
- Deterministic and testable rule evaluation
- Safe file/image handling by copying assets to cache directory
- Phase-by-phase delivery with review checkpoints

---

## Phase 1 - Architecture and Contracts ✅
### Scope
- Set up folder/module structure based on clean architecture.
- Define domain entities and interfaces.
- Define JSON schema contract for form, sections, fields, rules, and submission output.

### Deliverables
- Finalized architecture skeleton.
- Type definitions/interfaces for:
  - `FormSchema`
  - `SectionSchema`
  - `FieldSchema` (all supported field types)
  - `VisibilityRule`, `ValidationRule`, rule groups (`all`, `any`, `not`)
  - `FormSubmission` output model
- Basic dependency wiring plan.

### Review Checklist
- JSON contract is complete and unambiguous.
- Rule language supports cross-section dependencies.
- Section-first structure is approved.

---

## Phase 2 - Dynamic Renderer (Base Fields + Sections)
### Scope
- Build dynamic form renderer from JSON.
- Render multiple sections in order.
- Implement field rendering registry and base form state.

### Deliverables
- `DynamicFormScreen` with schema-driven rendering.
- Base field components:
  - text input
  - radio group
  - checkbox group (multi-select)
- Section UI wrappers and ordered rendering.

### Review Checklist
- Any valid schema renders without hardcoded fields.
- Section structure and field mapping are correct.
- Field value updates are reflected in centralized form state.

---

## Phase 3 - Validation Engine (Normal + Dynamic)
### Scope
- Implement reusable validation engine with two levels:
  - normal/static rules
  - dynamic/conditional rules
- Support rule combinators and intersection (`all`).

### Deliverables
- Validation evaluator service.
- Validation triggers (on change, on blur, on submit).
- Error model and per-field/section error rendering.

### Review Checklist
- Required/pattern/length/selection validations work.
- Dynamic required and conditional validations work.
- Cross-section intersection validations are correct.

---

## Phase 4 - Dynamic Visibility Engine
### Scope
- Implement visibility resolver for sections and fields.
- Support nested condition groups (`all`, `any`, `not`) and cross-section references.
- Handle hidden-field data policy.

### Deliverables
- Visibility evaluator service.
- Real-time show/hide updates tied to form state.
- Configurable hidden-value behavior (`clear` vs `retain`).

### Review Checklist
- Visibility updates correctly on dependent field changes.
- Section-level visibility works with intersection logic.
- No cyclic dependency crashes.

---

## Phase 5 - File and Image Features with Cache Persistence
### Scope
- Add file picker.
- Add image picker from gallery/folder and camera.
- Copy selected assets into app cache and normalize metadata.

### Deliverables
- Field components:
  - file picker field
  - image picker field
- Cache persistence service for assets.
- Attachment metadata model (name, mime, size, source, cached path).

### Review Checklist
- File/image selection works across supported sources.
- Cached copy path is stable and stored in form state.
- Permission denied/cancel scenarios handled safely.

---

## Phase 6 - Submission Save and Result JSON
### Scope
- Build submission output mapper.
- Save submission records locally for demo use.
- Ensure output includes cached asset paths.

### Deliverables
- `CreateSubmission` use case.
- Result JSON builder.
- Local submissions repository.

### Review Checklist
- Output JSON shape matches approved contract.
- Arrays/scalars/attachments serialized correctly.
- Validation gates submission as expected.

---

## Phase 7 - Submitted Forms List, Details, and Edit Mode
### Scope
- Add submitted forms listing flow.
- Add details screen.
- Enable edit mode with prefilled values and re-save.

### Deliverables
- `FormListScreen` (all submissions).
- `FormDetailsScreen` (single submission view).
- Edit action to open dynamic form in edit mode.
- `UpdateSubmission` use case with `updatedAt`.

### Review Checklist
- List -> details navigation works.
- Edit mode prefill includes files/images.
- Updated submission persists and refreshes list/details.

---

## Phase 8 - Random Form Generator (Demo Utility)
### Scope
- Add button to generate random dynamic form schema.
- Include random sections, fields, and rules.
- Enforce guardrails so generated forms are always usable.

### Deliverables
- `GenerateRandomSchema` use case.
- Demo action entry point in UI.
- Safety checks (no invalid references/cycles/impossible constraints).

### Review Checklist
- Random forms render consistently.
- Generated validations/visibility are meaningful.
- Generated form is always submittable through at least one path.

---

## Phase 9 - Testing and Documentation
### Scope
- Add targeted unit/integration tests.
- Document schema contract and extension guide.

### Deliverables
- Unit tests:
  - validation engine
  - visibility engine
  - submission mapper
  - random schema generator
- Integration tests for core form flows.
- Documentation for:
  - JSON schema authoring
  - adding new field type
  - known constraints and assumptions

### Review Checklist
- Critical flows are covered by tests.
- Schema docs are practical and example-driven.
- Team can extend new field/rule types with minimal friction.

---

## Milestone Gate Policy
Before moving to the next phase:
- demo current phase end-to-end
- capture feedback and apply corrections
- freeze phase decisions in docs

## Proposed Execution Order
1. Phase 1  
2. Phase 2  
3. Phase 3  
4. Phase 4  
5. Phase 5  
6. Phase 6  
7. Phase 7  
8. Phase 8  
9. Phase 9

## First Implementation Slice (after approval)
- Complete Phase 1 and share:
  - final folder structure
  - JSON contract examples (including cross-section intersection rules)
  - dependency flow diagram (textual)
