# Extending the Dynamic Forms Demo

## Add a new field type

### 1. Domain contract

Update `src/shared/constants/form.ts`:

```ts
export const FIELD_TYPES = [..., 'myField'] as const;
```

Add interface in `src/domain/entities/schema/fields.ts` and extend `FieldSchema` union.

### 2. Field component

Create `src/presentation/components/forms/MyField.tsx`:

- Read/write via `useFormContext()` (`values`, `setFieldValue`, `onFieldBlur`)
- Show errors via `shouldShowFieldError` / `getFieldError`
- Use `FieldLabel` and `FieldErrorText` for consistency

### 3. Renderer registry

Register in `src/presentation/components/forms/FieldRenderer.tsx`:

```ts
case 'myField':
  return <MyField field={field} />;
```

### 4. Default value

Update `getDefaultFieldValue()` in `src/shared/utils/form-schema-utils.ts`.

### 5. Validation (if needed)

Extend `ValidationEngine.validateRule()` in `src/domain/services/validation-engine.ts`.

### 6. Submission output

If the field produces a custom value shape, ensure `isEmptyValue()` in `src/domain/utils/value-utils.ts` handles it and `buildSubmissionResult()` serializes correctly.

### 7. Schema guard

Update `assertFormSchema()` if the type needs extra properties validated at load time.

---

## Add a new validation rule type

1. Add to `VALIDATION_RULE_TYPES` in `src/shared/constants/form.ts`
2. Add to `ValidationRuleType` in `src/domain/entities/schema/rules.ts`
3. Implement in `ValidationEngine.validateRule()`
4. Add default message in `src/domain/services/validation-messages.ts`
5. Document in `docs/JSON_SCHEMA.md`

---

## Add a new condition operator

1. Add to `CONDITION_OPERATORS` in `src/shared/constants/form.ts`
2. Implement in `RuleEvaluator.evaluateCondition()`
3. Add unit tests in `__tests__/rule-evaluator.test.ts`
4. Document in `docs/JSON_SCHEMA.md`

---

## Add a new use case

1. Create `src/domain/use-cases/my-use-case.ts` (depends on repository interfaces only)
2. Register in `src/infrastructure/di/app-container.ts`
3. Call from presentation layer via `getAppContainer()`
4. Add tests with in-memory repository stubs

---

## Add a bundled schema

1. Create JSON under `src/assets/schemas/`
2. Import and register in `app-container.ts` `InMemorySchemaRepository` constructor array
3. Verify with `assertFormSchema` at startup

---

## File reference map

| Concern | Location |
|---------|----------|
| JSON types | `src/domain/entities/schema/` |
| Rule evaluation | `src/domain/services/rule-evaluator.ts` |
| Validation | `src/domain/services/validation-engine.ts` |
| Visibility | `src/domain/services/visibility-engine.ts` |
| Form state | `src/presentation/forms/hooks/` |
| Field UI | `src/presentation/components/forms/` |
| DI wiring | `src/infrastructure/di/app-container.ts` |
