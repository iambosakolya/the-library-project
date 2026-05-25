export const actionBarStyles = {
  wrapper: 'flex flex-wrap gap-3',
  button: 'flex items-center gap-2',
};

export const approveDialogStyles = {
  formSection: 'space-y-4 py-4',
  inputGroup: 'space-y-2',
};

export const mergeDialogStyles = {
  content: 'max-w-2xl',
  formSection: 'space-y-4 py-4',
  searchRow: 'flex gap-2',
  resultsWrapper: 'max-h-96 space-y-2 overflow-y-auto',
  resultsHint: 'text-sm text-muted-foreground',
  card: 'flex w-full items-start gap-3 rounded-lg border p-3 text-left transition hover:bg-accent',
  cardSelected: 'border-primary bg-accent',
  cardImage: 'rounded object-cover',
  cardInfo: 'flex-1',
  cardTitle: 'font-medium',
  cardAuthor: 'text-sm text-muted-foreground',
  cardCheck: 'mt-1 text-sm font-medium text-primary',
};

export const rejectDialogStyles = {
  formSection: 'space-y-4 py-4',
  inputGroup: 'space-y-2',
  textarea: 'min-h-24',
};
