import { useCallback, useEffect, useState } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import type { FormSchema } from './src/domain';
import { getAppContainer } from './src/infrastructure/di/app-container';
import { DynamicFormScreen } from './src/presentation/screens/DynamicFormScreen';
import { SchemaListScreen } from './src/presentation/screens/SchemaListScreen';
import { formColors } from './src/presentation/theme/forms';

type AppRoute =
  | { name: 'list' }
  | { name: 'form'; schema: FormSchema };

function App() {
  const [route, setRoute] = useState<AppRoute>({ name: 'list' });
  const [schemas, setSchemas] = useState<FormSchema[]>([]);
  const [submissionCount, setSubmissionCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadSubmissions = useCallback(async () => {
    const result = await getAppContainer().submissionRepository.list();
    if (result.success) {
      setSubmissionCount(result.data.length);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const result = await getAppContainer().schemaRepository.getAll();
      if (result.success) {
        setSchemas(result.data);
        setLoadError(null);
      } else {
        setLoadError(result.error);
      }
      await loadSubmissions();
      setLoading(false);
    };
    load();
  }, [loadSubmissions]);

  const openForm = useCallback((schema: FormSchema) => {
    setRoute({ name: 'form', schema });
  }, []);

  const goBack = useCallback(() => {
    setRoute({ name: 'list' });
    loadSubmissions();
  }, [loadSubmissions]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.root} edges={['top', 'left', 'right']}>
        <StatusBar barStyle="dark-content" />
        {route.name === 'list' ? (
          <SchemaListScreen
            schemas={schemas}
            loading={loading}
            error={loadError}
            submissionCount={submissionCount}
            onSelectSchema={openForm}
          />
        ) : (
          <DynamicFormScreen
            schema={route.schema}
            onBack={goBack}
            onSubmissionSaved={loadSubmissions}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: formColors.background,
  },
});

export default App;
