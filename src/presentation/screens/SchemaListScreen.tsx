import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { FormSchema } from '../../domain/entities/schema/form-schema';
import { formColors, formSpacing } from '../theme/forms';

interface SchemaListScreenProps {
  schemas: FormSchema[];
  loading: boolean;
  error: string | null;
  onSelectSchema: (schema: FormSchema) => void;
}

export function SchemaListScreen({
  schemas,
  loading,
  error,
  onSelectSchema,
}: SchemaListScreenProps) {
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={formColors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={schemas}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.list}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.title}>Dynamic Forms Demo</Text>
          <Text style={styles.subtitle}>
            Select a form to open
          </Text>
        </View>
      }
      renderItem={({ item }) => (
        <Pressable
          style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
          onPress={() => onSelectSchema(item)}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardMeta}>
            {item.sections.length} sections · v{item.version}
          </Text>
          {item.description ? (
            <Text style={styles.cardDescription} numberOfLines={2}>
              {item.description}
            </Text>
          ) : null}
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
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
  header: {
    marginBottom: formSpacing.lg,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: formColors.text,
  },
  subtitle: {
    fontSize: 14,
    color: formColors.textSecondary,
    marginTop: formSpacing.xs,
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
  cardDescription: {
    fontSize: 14,
    color: formColors.textSecondary,
    marginTop: formSpacing.sm,
  },
  error: {
    color: formColors.error,
    fontSize: 15,
    textAlign: 'center',
  },
});
