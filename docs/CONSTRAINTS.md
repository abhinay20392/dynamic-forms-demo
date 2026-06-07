# Known Constraints and Assumptions

## Schema

- **Field ids are globally unique** across all sections. Duplicate ids throw at schema load.
- **Rule references must not point forward** to later sections (recommended; random generator enforces this).
- **No cyclic rule graphs** are detected automatically — avoid rules that depend on each other's visibility in a loop.
- Schema validation at runtime is **lightweight** (`assertFormSchema`). Full JSON Schema validation is not implemented.

## Visibility

- Default `hiddenValuePolicy` is **`clear`**: hidden field values are reset to defaults.
- Hidden sections and fields are **excluded from validation** on submit.
- Section visibility is evaluated before field visibility within that section.

## Validation

- Validation runs on **visible fields only** when visibility engine is wired (default in app).
- Dynamic rules use the same `RuleGroup` syntax as visibility.
- File/image `required` treats empty attachment as invalid; MIME and size rules need an attachment present.

## Attachments

- Picked files/images are **copied to** `CacheDir/dynamic-forms/`.
- Result JSON stores **`cachedPath`** (local path), not the temporary picker URI.
- Cached files are deleted when replaced or removed via the field UI; orphaned cache files from hidden-field clears are not aggressively purged.

## Storage

- Submissions persist in **AsyncStorage** (demo only, not encrypted).
- Schemas from the random generator and bundled samples live in **memory** (`InMemorySchemaRepository`) for the app session.

## Platform

- Document picker uses `@react-native-documents/picker` (RN 0.85+).
- Image picker requires camera/photo permissions on device.
- Native rebuild required after adding picker/storage dependencies.

## Edit mode

- Edit prefills from saved `submission.values` merged with schema defaults.
- Attachments reference existing cache paths; replacing a file deletes the old cached copy.

## Random form generator

- Guarantees at least one **always-visible required** text field in the Basics section.
- Business/Documents sections are probabilistic; not every generated form includes all field types.
- Optional `seed` parameter produces deterministic output for tests.
