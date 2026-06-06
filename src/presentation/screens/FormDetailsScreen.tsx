import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { FormSchema } from '../../domain/entities/schema/form-schema';
import type { FormSubmission } from '../../domain/entities/submission/form-submission';
import { getAppContainer } from '../../infrastructure/di/app-container';
import {
  buildSubmissionSectionDisplay,
  formatSubmissionDate,
  toPreviewUri,
} from '../../shared/utils/submission-display';
import { formColors, formSpacing } from '../theme/forms';

interface FormDetailsScreenProps {
  submissionId: string;
  onBack: () => void;
  onEdit: (submission: FormSubmission, schema: FormSchema) => void;
}

export function FormDetailsScreen({
  submissionId,
  onBack,
  onEdit,
}: FormDetailsScreenProps) {
  const [submission, setSubmission] = useState<FormSubmission | null>(null);
  const [schema, setSchema] = useState<FormSchema | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const container = getAppContainer();
    const submissionResult =
      await container.submissionRepository.getById(submissionId);

    if (!submissionResult.success) {
      setError(submissionResult.error);
      setLoading(false);
      return;
    }

    const schemaResult = await container.schemaRepository.getById(
      submissionResult.data.schemaId,
    );

    if (!schemaResult.success) {
      setError(schemaResult.error);
      setLoading(false);
      return;
    }

    setSubmission(submissionResult.data);
    setSchema(schemaResult.data);
    setError(null);
    setLoading(false);
  }, [submissionId]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={formColors.primary} />
      </View>
    );
  }

  if (error || !submission || !schema) {
    return (
      <View style={styles.container}>
        <View style={styles.toolbar}>
          <Pressable onPress={onBack} style={styles.backButton}>
            <Text style={styles.backLabel}>← Back</Text>
          </Pressable>
        </View>
        <View style={styles.centered}>
          <Text style={styles.error}>{error ?? 'Submission not found'}</Text>
        </View>
      </View>
    );
  }

  const sections = buildSubmissionSectionDisplay(schema, submission);

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <Text style={styles.backLabel}>← Back</Text>
        </Pressable>
        <Text style={styles.toolbarTitle} numberOfLines={1}>
          {submission.title}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.metaBox}>
          <Text style={styles.metaLine}>ID: {submission.id}</Text>
          <Text style={styles.metaLine}>
            Created: {formatSubmissionDate(submission.createdAt)}
          </Text>
          {submission.updatedAt ? (
            <Text style={styles.metaLine}>
              Updated: {formatSubmissionDate(submission.updatedAt)}
            </Text>
          ) : null}
          <Text style={styles.metaLine}>
            Schema: {submission.schemaId} v{submission.schemaVersion}
          </Text>
        </View>

        {sections.map(section => (
          <View key={section.sectionId} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.fields.map(field => (
              <View key={field.fieldId} style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>{field.label}</Text>
                {field.isImage && field.attachmentPath ? (
                  <Image
                    source={{ uri: toPreviewUri(field.attachmentPath) }}
                    style={styles.preview}
                  />
                ) : null}
                <Text style={styles.fieldValue}>{field.displayValue}</Text>
                {field.attachmentPath && !field.isImage ? (
                  <Text style={styles.cachePath}>{field.attachmentPath}</Text>
                ) : null}
              </View>
            ))}
          </View>
        ))}

        <View style={styles.jsonBox}>
          <Text style={styles.jsonTitle}>Full JSON</Text>
          <Text style={styles.jsonText}>
            {JSON.stringify(submission, null, 2)}
          </Text>
        </View>

        <Pressable
          style={styles.editButton}
          onPress={() => onEdit(submission, schema)}>
          <Text style={styles.editLabel}>Edit submission</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: formColors.background,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: formSpacing.md,
    paddingVertical: formSpacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: formColors.border,
  },
  backButton: {
    paddingRight: formSpacing.md,
    paddingVertical: formSpacing.sm,
  },
  backLabel: {
    fontSize: 16,
    color: formColors.primary,
    fontWeight: '600',
  },
  toolbarTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: formColors.text,
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: formSpacing.lg,
  },
  content: {
    padding: formSpacing.lg,
    paddingBottom: formSpacing.lg * 3,
  },
  metaBox: {
    padding: formSpacing.md,
    borderRadius: 8,
    backgroundColor: formColors.surface,
    marginBottom: formSpacing.lg,
  },
  metaLine: {
    fontSize: 13,
    color: formColors.textSecondary,
    marginBottom: formSpacing.xs,
  },
  section: {
    marginBottom: formSpacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: formColors.text,
    marginBottom: formSpacing.md,
  },
  fieldRow: {
    marginBottom: formSpacing.md,
    paddingBottom: formSpacing.md,
    borderBottomWidth: 1,
    borderBottomColor: formColors.border,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: formColors.text,
    marginBottom: formSpacing.xs,
  },
  fieldValue: {
    fontSize: 15,
    color: formColors.text,
  },
  preview: {
    width: '100%',
    height: 140,
    borderRadius: 6,
    marginVertical: formSpacing.sm,
    backgroundColor: formColors.border,
  },
  cachePath: {
    fontSize: 11,
    color: formColors.placeholder,
    marginTop: formSpacing.xs,
  },
  jsonBox: {
    padding: formSpacing.md,
    borderRadius: 8,
    backgroundColor: formColors.surface,
    marginBottom: formSpacing.lg,
  },
  jsonTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: formColors.textSecondary,
    marginBottom: formSpacing.sm,
  },
  jsonText: {
    fontFamily: 'Menlo',
    fontSize: 11,
    color: formColors.text,
  },
  editButton: {
    backgroundColor: formColors.primary,
    paddingVertical: formSpacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  editLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    color: formColors.error,
    fontSize: 15,
    textAlign: 'center',
  },
});
