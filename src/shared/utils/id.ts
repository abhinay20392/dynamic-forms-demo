export function generateSubmissionId(): string {
  const suffix = Math.random().toString(36).slice(2, 10);
  return `sub-${Date.now()}-${suffix}`;
}
