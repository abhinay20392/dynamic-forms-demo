# JSON Form Schema Contract

Version: **1.0.0** (see `FORM_SCHEMA_VERSION` in `src/shared/constants/form.ts`)

## Root: `FormSchema`

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | yes | Unique form identifier |
| `title` | string | yes | Display title |
| `version` | string | yes | Schema version for submissions |
| `description` | string | no | Optional subtitle |
| `hiddenValuePolicy` | `"clear"` \| `"retain"` | no | Behavior when field/section hidden (default `clear`) |
| `sections` | `SectionSchema[]` | yes | Ordered sections (use `order` for sort) |

## Section: `SectionSchema`

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | yes | Section id |
| `title` | string | yes | Section heading |
| `order` | number | yes | Sort key (ascending) |
| `description` | string | no | Optional helper text |
| `visibility` | `RuleGroup` | no | Section visible when rule passes |
| `validation` | `RuleGroup` | no | Section-level gate on submit |
| `fields` | `FieldSchema[]` | yes | Fields in this section |

## Field types

All fields share: `id`, `label`, `type`, optional `order`, `required`, `defaultValue`, `placeholder`, `helperText`, `visibility`, `validation`.

| `type` | Extra properties |
|--------|------------------|
| `text` | `keyboardType`, `maxLength` |
| `radio` | `options: { label, value }[]` |
| `checkbox` | `options` (multi-select values) |
| `file` | `allowedMimeTypes`, `maxFileSizeBytes` |
| `image` | `allowCamera`, `allowGallery`, `maxFileSizeBytes` |

**Field ids are global** across sections (used in rules and submission JSON).

## Rules: `RuleGroup`

Composable logic for visibility and dynamic validation:

```json
{
  "all": [
    { "field": "employmentType", "op": "equals", "value": "self_employed" },
    { "field": "country", "op": "equals", "value": "IN" }
  ]
}
```

| Combinator | Meaning |
|------------|---------|
| `all` | Intersection (AND) — all expressions must pass |
| `any` | Union (OR) — at least one must pass |
| `not` | Negation of a single expression or nested group |

Expressions are either a **condition** or nested **group**.

### Condition

```json
{ "field": "businessName", "op": "isNotEmpty" }
```

| `op` | `value` required? |
|------|-------------------|
| `equals`, `notEquals` | yes |
| `in`, `notIn` | yes (array) |
| `contains` | yes (string or array membership) |
| `greaterThan`, `greaterThanOrEqual`, `lessThan`, `lessThanOrEqual` | yes (number) |
| `isEmpty`, `isNotEmpty` | no |

## Validation rules

Static:

```json
{ "type": "minLength", "value": 2, "message": "Too short" }
```

Dynamic (conditional):

```json
{
  "type": "required",
  "message": "Business name required",
  "when": {
    "all": [
      { "field": "employmentType", "op": "equals", "value": "self_employed" },
      { "field": "country", "op": "equals", "value": "IN" }
    ]
  }
}
```

Supported `type` values: `required`, `minLength`, `maxLength`, `pattern`, `minSelections`, `maxSelections`, `allowedMimeTypes`, `maxFileSizeBytes`.

## Submission output (preview)

Saved submissions (`FormSubmission`) use field ids as keys:

```json
{
  "id": "sub-uuid",
  "schemaId": "sample-cross-section",
  "schemaVersion": "1.0.0",
  "title": "Employment & Documents",
  "values": {
    "fullName": "Jane Doe",
    "interests": ["sports", "tech"],
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

## Bundled examples

- `src/assets/schemas/sample-basic.form.json` — static validation, radio/checkbox
- `src/assets/schemas/sample-cross-section.form.json` — `all` / `any` / `not` across sections, file/image fields

## Authoring tips

### Cross-section intersection (section visibility)

Show a section only when two fields in an earlier section match:

```json
"visibility": {
  "all": [
    { "field": "employmentType", "op": "equals", "value": "self_employed" },
    { "field": "country", "op": "equals", "value": "IN" }
  ]
}
```

### Union visibility

Show when either condition is true:

```json
"visibility": {
  "any": [
    { "field": "employmentType", "op": "equals", "value": "employed" },
    {
      "all": [
        { "field": "employmentType", "op": "equals", "value": "self_employed" },
        { "field": "businessName", "op": "isNotEmpty" }
      ]
    }
  ]
}
```

### Negation

```json
"validation": {
  "not": { "field": "employmentType", "op": "equals", "value": "student" }
}
```

### Section-level validation gate

Fails section validation on submit when rule does not pass (section must be visible):

```json
"validation": {
  "all": [{ "field": "employmentType", "op": "notEquals", "value": "student" }]
}
```

### Best practices

- Keep **field ids unique** globally.
- Reference only fields in **same or earlier sections** to avoid cycles.
- Put always-visible required fields in the first section for a guaranteed submit path.
- Use `hiddenValuePolicy: "clear"` when hidden data should not leak into submissions.

## Adding a schema

1. Add JSON under `src/assets/schemas/`.
2. Register in `src/infrastructure/di/app-container.ts` constructor array.
3. Run app — `assertFormSchema` validates at startup when repository is built.

See also: [EXTENDING.md](EXTENDING.md), [CONSTRAINTS.md](CONSTRAINTS.md).
