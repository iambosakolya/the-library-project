export const dialogStyles = {
  content: 'max-h-[90vh] max-w-3xl overflow-y-auto',
  sectionWrapper: 'space-y-6',
};

export const headerStyles = {
  wrapper: 'flex items-start justify-between gap-4',
  info: 'flex-1',
  title: 'mb-2 text-2xl',
  description: 'text-base',
  badge: 'text-sm capitalize',
};

export const userInfoStyles = {
  box: 'rounded-lg bg-muted p-4',
  title: 'mb-2 flex items-center gap-2 font-semibold',
  details: 'space-y-1 text-sm',
  name: 'font-medium',
  email: 'flex items-center gap-1 text-muted-foreground',
  date: 'text-muted-foreground',
};

export const statsStyles = {
  grid: 'grid grid-cols-2 gap-4 md:grid-cols-4',
  label: 'mb-1 flex items-center gap-2 text-muted-foreground',
  labelText: 'text-xs font-medium',
  value: 'text-sm font-semibold',
};

export const contentStyles = {
  sectionTitle: 'mb-2 font-semibold',
  descriptionText: 'whitespace-pre-wrap text-sm text-muted-foreground',
  linkText: 'break-all text-sm text-primary hover:underline',
  addressText: 'text-sm text-muted-foreground',
  booksTitle: 'mb-2 flex items-center gap-2 font-semibold',
  booksCount: 'text-sm text-muted-foreground',
};

export const actionStyles = {
  wrapper: 'flex gap-3 border-t pt-4',
  button: 'flex-1',
  rejectionBox: 'rounded-lg border border-destructive/20 bg-destructive/10 p-4',
  rejectionTitle: 'mb-2 font-semibold text-destructive',
  rejectionText: 'text-sm text-muted-foreground',
};

export const iconStyles = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
};
