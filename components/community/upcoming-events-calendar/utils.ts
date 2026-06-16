export function formatEventDate(dateStr: string) {
  const d = new Date(dateStr);
  const month = d.toLocaleDateString('en-US', { month: 'short' });
  const day = d.getDate();
  const time = d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
  return { month, day, time };
}
