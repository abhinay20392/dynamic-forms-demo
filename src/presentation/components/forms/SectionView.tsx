import { StyleSheet, Text, View } from 'react-native';
import type { SectionSchema } from '../../../domain/entities/schema/sections';
import { getSortedFields } from '../../../shared/utils/form-schema-utils';
import { useFormContext } from '../../forms/context/FormContext';
import { formColors, formSpacing } from '../../theme/forms';
import { FieldRenderer } from './FieldRenderer';

interface SectionViewProps {
  section: SectionSchema;
}

export function SectionView({ section }: SectionViewProps) {
  const {
    isSectionVisible,
    isFieldVisible,
    shouldShowSectionError,
    getSectionError,
  } = useFormContext();

  if (!isSectionVisible(section.id)) {
    return null;
  }

  const fields = getSortedFields(section).filter(field =>
    isFieldVisible(field.id),
  );
  const sectionError = getSectionError(section.id);
  const showSectionError = shouldShowSectionError(section.id);

  if (fields.length === 0 && !showSectionError) {
    return null;
  }

  return (
    <View style={styles.section}>
      <Text style={styles.title}>{section.title}</Text>
      {section.description ? (
        <Text style={styles.description}>{section.description}</Text>
      ) : null}
      {showSectionError && sectionError ? (
        <Text style={styles.sectionError}>{sectionError}</Text>
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
  sectionError: {
    fontSize: 13,
    color: formColors.error,
    marginBottom: formSpacing.md,
    padding: formSpacing.sm,
    backgroundColor: '#fef2f2',
    borderRadius: 6,
  },
  fields: {
    gap: formSpacing.lg,
  },
  field: {
    marginBottom: formSpacing.sm,
  },
});
