export const headerStyles = {
  icon: 'h-5 w-5',
  title: 'flex items-center gap-2',
};

export const tableStyles = {
  loadingText: 'py-8 text-center text-muted-foreground',
  emptyText: 'py-8 text-center text-muted-foreground',
  actionButton: 'h-7 w-7',
  actionIcon: 'h-3.5 w-3.5',
  deleteButton: 'h-7 w-7 text-destructive',
};

export const paginationStyles = {
  wrapper: 'mt-4 flex items-center justify-between',
  text: 'text-sm text-muted-foreground',
  buttons: 'flex gap-2',
};

export const statusColors: Record<string, string> = {
  completed:
    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  default:
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
};
