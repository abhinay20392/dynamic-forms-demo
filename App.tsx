import { useEffect, useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import type { FormSchema } from './src/domain';
import { getAppContainer } from './src/infrastructure/di/app-container';

function App() {
  const [schemas, setSchemas] = useState<FormSchema[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const result = await getAppContainer().schemaRepository.getAll();
      if (result.success) {
        setSchemas(result.data);
        setLoadError(null);
      } else {
        setLoadError(result.error);
      }
    };
    load();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.title}>Dynamic Forms Demo</Text>
      <Text style={styles.subtitle}>Phase 1 — Architecture ready</Text>
      <View style={styles.card}>
        {loadError ? (
          <Text style={styles.error}>{loadError}</Text>
        ) : (
          <>
            <Text style={styles.label}>
              Loaded schemas: {schemas.length}
            </Text>
            {schemas.map(schema => (
              <Text key={schema.id} style={styles.schemaItem}>
                • {schema.title} ({schema.sections.length} sections)
              </Text>
            ))}
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  card: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  schemaItem: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
  },
  error: {
    color: '#c00',
    fontSize: 14,
  },
});

export default App;
