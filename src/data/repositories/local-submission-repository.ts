import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
  FormSubmission,
  FormSubmissionSummary,
} from '../../domain/entities/submission/form-submission';
import type { ISubmissionRepository } from '../../domain/repositories/submission-repository';
import { err, ok, type Result } from '../../shared/types/result';

const STORAGE_KEY = '@dynamic_forms_demo/submissions';

function toSummary(submission: FormSubmission): FormSubmissionSummary {
  return {
    id: submission.id,
    schemaId: submission.schemaId,
    title: submission.title,
    createdAt: submission.createdAt,
    updatedAt: submission.updatedAt,
  };
}

export class LocalSubmissionRepository implements ISubmissionRepository {
  private async readAll(): Promise<FormSubmission[]> {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as FormSubmission[];
    return Array.isArray(parsed) ? parsed : [];
  }

  private async writeAll(submissions: FormSubmission[]): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
  }

  async list(): Promise<Result<FormSubmissionSummary[]>> {
    try {
      const submissions = await this.readAll();
      const sorted = [...submissions].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      return ok(sorted.map(toSummary));
    } catch {
      return err('Failed to load submissions');
    }
  }

  async getById(id: string): Promise<Result<FormSubmission>> {
    try {
      const submissions = await this.readAll();
      const found = submissions.find(item => item.id === id);
      if (!found) {
        return err(`Submission not found: ${id}`);
      }
      return ok(found);
    } catch {
      return err('Failed to load submission');
    }
  }

  async create(submission: FormSubmission): Promise<Result<FormSubmission>> {
    try {
      const submissions = await this.readAll();
      submissions.push(submission);
      await this.writeAll(submissions);
      return ok(submission);
    } catch {
      return err('Failed to save submission');
    }
  }

  async update(submission: FormSubmission): Promise<Result<FormSubmission>> {
    try {
      const submissions = await this.readAll();
      const index = submissions.findIndex(item => item.id === submission.id);
      if (index < 0) {
        return err(`Submission not found: ${submission.id}`);
      }
      submissions[index] = {
        ...submission,
        updatedAt: submission.updatedAt ?? new Date().toISOString(),
      };
      await this.writeAll(submissions);
      return ok(submissions[index]);
    } catch {
      return err('Failed to update submission');
    }
  }

  async delete(id: string): Promise<Result<void>> {
    try {
      const submissions = await this.readAll();
      const next = submissions.filter(item => item.id !== id);
      if (next.length === submissions.length) {
        return err(`Submission not found: ${id}`);
      }
      await this.writeAll(next);
      return ok(undefined);
    } catch {
      return err('Failed to delete submission');
    }
  }
}
