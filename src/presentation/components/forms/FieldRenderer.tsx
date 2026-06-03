import type { FieldSchema } from '../../../domain/entities/schema/fields';
import { CheckboxGroupField } from './CheckboxGroupField';
import { FilePickerField } from './FilePickerField';
import { ImagePickerField } from './ImagePickerField';
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
      return <FilePickerField field={field} />;
    case 'image':
      return <ImagePickerField field={field} />;
    default:
      return null;
  }
}
