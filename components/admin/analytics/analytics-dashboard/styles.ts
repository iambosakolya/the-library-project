export const layoutStyles = {
  wrapper: 'space-y-6',
  emptyState: 'flex flex-col items-center justify-center py-16',
  emptyIcon: 'mb-4 h-12 w-12 text-muted-foreground',
  emptyText: 'text-lg text-muted-foreground',
};

export const controlsStyles = {
  headerIcon: 'h-5 w-5',
  headerTitle: 'flex items-center gap-2',
  wrapper: 'flex flex-wrap items-end gap-4',
  group: 'space-y-1.5',
  label: 'text-sm font-medium',
  categorySelect: 'w-[220px]',
  periodSelect: 'w-[180px]',
  dateInput: 'w-[160px]',
};

export const progressStyles = {
  wrapper: 'mt-4',
  header: 'mb-1 flex justify-between text-sm text-muted-foreground',
  bar: 'h-2 overflow-hidden rounded-full bg-muted',
  fill: 'h-full rounded-full bg-primary transition-all duration-500',
};

export const exportStyles = {
  wrapper: 'mt-4 flex items-center gap-2',
  label: 'text-sm text-muted-foreground',
};

export const tabStyles = {
  list: 'grid w-full grid-cols-4',
  trigger: 'flex items-center gap-1',
  triggerLabel: 'hidden sm:inline',
  content: 'mt-4 space-y-4',
};
