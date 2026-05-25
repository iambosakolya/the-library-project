export const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const HOURS = Array.from({ length: 24 }, (_, i) =>
  i === 0 ? '12am' : i < 12 ? `${i}am` : i === 12 ? '12pm' : `${i - 12}pm`,
);

export function getIntensity(count: number, max: number): string {
  if (count === 0) return 'bg-muted';
  const ratio = count / max;
  if (ratio < 0.2) return 'bg-indigo-100 dark:bg-indigo-950';
  if (ratio < 0.4) return 'bg-indigo-200 dark:bg-indigo-900';
  if (ratio < 0.6) return 'bg-indigo-300 dark:bg-indigo-800';
  if (ratio < 0.8) return 'bg-indigo-400 dark:bg-indigo-700';
  return 'bg-indigo-500 dark:bg-indigo-600';
}
