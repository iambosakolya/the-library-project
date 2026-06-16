/**
 * Truncate text to a specified length, appending an ellipsis if truncated.
 */
export function truncateText(text: string, maxLength: number): string {
  return text.length > maxLength ? text.slice(0, maxLength) + '…' : text;
}
