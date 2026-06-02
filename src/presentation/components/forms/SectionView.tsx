import { StyleSheet, Text, View } from 'react-native';
import type { SectionSchema } from '../../../domain/entities/schema/sections';
import { getSortedFields } from '../../../shared/utils/form-schema-utils';
import { formColors, formSpacing } from '../../theme/forms';
import { FieldRenderer } from './FieldRenderer';

interface SectionViewProps {
  section: SectionSchema;
}

export function SectionView({ section }: SectionViewProps) {
  const fields = getSortedFields(section);

  return (
    <View style={styles.section}>
      <Text style={styles.title}>{section.title}</Text>
      {section.description ? (
        <Text style={styles.description}>{section.description}</Text>
      ) : null}
      <View style={styles.fields}>
        {fields.map(field => (
          <View key={field.id} style={styles.field}>
            <FieldRenderer field={field} />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: formSpacing.lg,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: formColors.text,
    marginBottom: formSpacing.xs,
  },
  description: {
    fontSize: 14,
    color: formColors.textSecondary,
    marginBottom: formSpacing.md,
  },
  fields: {
    gap: formSpacing.lg,
  },
  field: {
    marginBottom: formSpacing.sm,
  },
});
