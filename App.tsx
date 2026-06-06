import { useCallback, useEffect, useState } from 'react';
import { Alert, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import type { FormSchema } from './src/domain';
import type { FormSubmission } from './src/domain/entities/submission/form-submission';
import { getAppContainer } from './src/infrastructure/di/app-container';
import { DynamicFormScreen } from './src/presentation/screens/DynamicFormScreen';
import { FormDetailsScreen } from './src/presentation/screens/FormDetailsScreen';
import { SchemaListScreen } from './src/presentation/screens/SchemaListScreen';
import { SubmissionListScreen } from './src/presentation/screens/SubmissionListScreen';
import { formColors } from './src/presentation/theme/forms';

type AppRoute =
  | { name: 'list' }
  | { name: 'submissions' }
  | { name: 'submissionDetails'; submissionId: string }
  | { name: 'form'; schema: FormSchema }
  | { name: 'formEdit'; schema: FormSchema; submission: FormSubmission };

function App() {
  const [route, setRoute] = useState<AppRoute>({ name: 'list' });
  const [schemas, setSchemas] = useState<FormSchema[]>([]);
  const [submissionCount, setSubmissionCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [detailsVersion, setDetailsVersion] = useState(0);

  const loadSchemas = useCallback(async () => {
    const result = await getAppContainer().schemaRepository.getAll();
    if (result.success) {
      setSchemas(result.data);
      setLoadError(null);
    } else {
      setLoadError(result.error);
    }
  }, []);

  const loadSubmissions = useCallback(async () => {
    const result = await getAppContainer().submissionRepository.list();
    if (result.success) {
      setSubmissionCount(result.data.length);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await loadSchemas();
      await loadSubmissions();
      setLoading(false);
    };
    load();
  }, [loadSchemas, loadSubmissions]);

  const openForm = useCallback((schema: FormSchema) => {
    setRoute({ name: 'form', schema });
  }, []);

  const openSubmissions = useCallback(() => {
    setRoute({ name: 'submissions' });
  }, []);

  const openSubmissionDetails = useCallback((submissionId: string) => {
    setRoute({ name: 'submissionDetails', submissionId });
  }, []);

  const openEditSubmission = useCallback(
    (submission: FormSubmission, schema: FormSchema) => {
      setRoute({ name: 'formEdit', schema, submission });
    },
    [],
  );

  const goToList = useCallback(() => {
    setRoute({ name: 'list' });
    loadSubmissions();
  }, [loadSubmissions]);

  const generateRandomForm = useCallback(async () => {
    setGenerating(true);
    const result =
      await getAppContainer().generateRandomSchemaUseCase.execute();
    setGenerating(false);

    if (!result.success) {
      Alert.alert('Generation failed', result.error);
      return;
    }

    await loadSchemas();
    setRoute({ name: 'form', schema: result.data });
  }, [loadSchemas]);

  const renderRoute = () => {
    switch (route.name) {
      case 'list':
        return (
          <SchemaListScreen
            schemas={schemas}
            loading={loading}
            generating={generating}
            error={loadError}
            submissionCount={submissionCount}
            onSelectSchema={openForm}
            onViewSubmissions={openSubmissions}
            onGenerateRandom={generateRandomForm}
          />
        );
      case 'submissions':
        return (
          <SubmissionListScreen
            onBack={goToList}
            onSelectSubmission={openSubmissionDetails}
          />
        );
      case 'submissionDetails':
        return (
          <FormDetailsScreen
            key={`${route.submissionId}-${detailsVersion}`}
            submissionId={route.submissionId}
            onBack={() => setRoute({ name: 'submissions' })}
            onEdit={openEditSubmission}
          />
        );
      case 'form':
        return (
          <DynamicFormScreen
            schema={route.schema}
            mode="create"
            onBack={goToList}
            onSubmissionSaved={() => {
              loadSubmissions();
            }}
          />
        );
      case 'formEdit':
        return (
          <DynamicFormScreen
            schema={route.schema}
            mode="edit"
            editingSubmission={route.submission}
            onBack={() =>
              setRoute({
                name: 'submissionDetails',
                submissionId: route.submission.id,
              })
            }
            onSubmissionSaved={updated => {
              loadSubmissions();
              setDetailsVersion(version => version + 1);
              setRoute({
                name: 'submissionDetails',
                submissionId: updated.id,
              });
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.root} edges={['top', 'left', 'right']}>
        <StatusBar barStyle="dark-content" />
        {renderRoute()}
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
