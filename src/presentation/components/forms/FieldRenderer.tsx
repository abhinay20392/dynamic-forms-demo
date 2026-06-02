import type { FieldSchema } from '../../../domain/entities/schema/fields';
import { CheckboxGroupField } from './CheckboxGroupField';
import { PlaceholderField } from './PlaceholderField';
import { RadioGroupField } from './RadioGroupField';
import { TextFieldInput } from './TextFieldInput';

interface FieldRendererProps {
  field: FieldSchema;
}

export function FieldRenderer({ field }: FieldRendererProps) {
  switch (field.type) {
    case 'text':
      return <TextFieldInput field={field} />;
    case 'radio':
      return <RadioGroupField field={field} />;
    case 'checkbox':
      return <CheckboxGroupField field={field} />;
    case 'file':
      return (
        <PlaceholderField
          field={field}
          message="File picker — coming in Phase 5"
        />
      );
    case 'image':
      return (
        <PlaceholderField
          field={field}
          message="Image picker — coming in Phase 5"
        />
      );
    default:
      return null;
  }
}
