# Known Constraints and Assumptions

Last updated for the completed Phase 9 release.

## Platform & dependencies

| Dependency | Version (approx.) | Notes |
|------------|-------------------|-------|
| React Native | 0.85.3 | Requires native rebuild after dep changes |
| `@react-native-documents/picker` | 12.x | Replaces deprecated `react-native-document-picker` |
| `react-native-image-picker` | 8.x | Camera + gallery; needs permissions |
| `react-native-blob-util` | 0.24.x | Cache file copy |
| `@react-native-async-storage/async-storage` | 3.x | Submission persistence |

- **Android:** `CAMERA` permission declared in `AndroidManifest.xml`.
- **iOS:** `NSCameraUsageDescription` and `NSPhotoLibraryUsageDescription` in `Info.plist`.
- **Node:** ≥ 22.11.0 (per `package.json` engines).

## Schema

- **Field ids are globally unique** across all sections. Duplicate ids throw at schema load.
- **Rule references** should only point to fields in the **same or earlier sections** (recommended; random generator enforces this).
- **No cyclic rule detection** — avoid visibility/validation loops manually.
- Runtime validation is **lightweight** (`assertFormSchema`), not full JSON Schema.

## Visibility

- Default `hiddenValuePolicy` is **`clear`**: hidden values reset to field defaults.
- Hidden sections and fields are **excluded from validation** on submit.
- Section visibility is evaluated before field visibility within that section.

## Validation

- Runs on **visible fields/sections only** (default app wiring).
- Dynamic rules share the same `RuleGroup` syntax as visibility.
- File/image `required` fails when no attachment; MIME/size rules require an attachment object.

## Attachments

- Files/images copied to **`CacheDir/dynamic-forms/`**.
- Submission JSON stores **`cachedPath`**, not temporary picker URIs.
- Replacing or removing an attachment deletes the previous cached file.
- Orphaned cache files from visibility clears are not bulk-purged.

## Storage

- Submissions: **AsyncStorage** (`@dynamic_forms_demo/submissions`) — demo only, not encrypted.
- Schemas: **in-memory** for app session (`InMemorySchemaRepository`). Random-generated schemas persist in memory until app restart.

## Edit mode

- Prefill merges `submission.values` with schema defaults via `buildInitialValues`.
- Existing attachment `cachedPath` values are restored; user can replace via pickers.

## Random form generator

- Always includes a **Basics** section with required `applicantName` (guaranteed submit path).
- Business and Documents sections are probabilistic (~85% / ~80%).
- Optional `seed` for deterministic test output.

## Navigation

- No deep linking or external navigation library — simple in-app route state in `App.tsx`.
- Edit flow returns to details screen after save.

## Not in scope (demo)

- Remote API / sync
- Authentication
- Offline schema sync from server
- Encrypted storage
- Full JSON Schema (draft) validation
