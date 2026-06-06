import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { FormSubmissionSummary } from '../../domain/entities/submission/form-submission';
import { getAppContainer } from '../../infrastructure/di/app-container';
import { formatSubmissionDate } from '../../shared/utils/submission-display';
import { formColors, formSpacing } from '../theme/forms';

interface SubmissionListScreenProps {
  onBack: () => void;
  onSelectSubmission: (submissionId: string) => void;
}

export function SubmissionListScreen({
  onBack,
  onSelectSubmission,
}: SubmissionListScreenProps) {
  const [submissions, setSubmissions] = useState<FormSubmissionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const result = await getAppContainer().submissionRepository.list();
    if (result.success) {
      setSubmissions(result.data);
      setError(null);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, []);

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

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <Text style={styles.backLabel}>← Back</Text>
        </Pressable>
        <Text style={styles.toolbarTitle}>Submitted Forms</Text>
      </View>

      {error ? (
        <View style={styles.centered}>
          <Text style={styles.error}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={submissions}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.empty}>
              No submissions yet. Fill out a form and submit.
            </Text>
          }
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [
                styles.card,
                pressed && styles.cardPressed,
              ]}
              onPress={() => onSelectSubmission(item.id)}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardMeta}>ID: {item.id}</Text>
              <Text style={styles.cardMeta}>
                Submitted: {formatSubmissionDate(item.createdAt)}
              </Text>
              {item.updatedAt ? (
                <Text style={styles.cardMeta}>
                  Updated: {formatSubmissionDate(item.updatedAt)}
                </Text>
              ) : null}
            </Pressable>
          )}
        />
      )}
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
  list: {
    padding: formSpacing.lg,
    paddingBottom: formSpacing.lg * 2,
  },
  empty: {
    fontSize: 15,
    color: formColors.textSecondary,
    textAlign: 'center',
    marginTop: formSpacing.lg,
  },
  card: {
    padding: formSpacing.md,
    marginBottom: formSpacing.md,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: formColors.border,
    backgroundColor: formColors.background,
  },
  cardPressed: {
    backgroundColor: formColors.primaryMuted,
    borderColor: formColors.primary,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: formColors.text,
  },
  cardMeta: {
    fontSize: 13,
    color: formColors.textSecondary,
    marginTop: formSpacing.xs,
  },
  error: {
    color: formColors.error,
    fontSize: 15,
    textAlign: 'center',
  },
});
