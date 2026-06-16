export const dashboardStyles = {
  wrapper: 'space-y-6',
  summaryGrid: 'grid gap-4 sm:grid-cols-2 lg:grid-cols-4',
  summaryCard: 'p-4',
  summaryRow: 'flex items-center gap-3',
  summaryLabel: 'text-sm text-muted-foreground',
  summaryValue: 'text-2xl font-bold',
  tabsWrapper: 'space-y-4',
  tabsHeader:
    'flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between',
  createButton: 'gap-1',
  tabContent: 'space-y-4',
  itemsGrid: 'grid gap-4 md:grid-cols-2',
};

export const summaryIconStyles = {
  active: 'rounded-lg bg-primary/10 p-2',
  pending: 'rounded-lg bg-amber-100 p-2 dark:bg-amber-900/30',
  participants: 'rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30',
  total: 'rounded-lg bg-green-100 p-2 dark:bg-green-900/30',
};

export const itemCardStyles = {
  wrapper: 'transition-shadow hover:shadow-lg',
  header: 'pb-3',
  headerRow: 'flex items-start justify-between gap-3',
  badges: 'flex flex-wrap items-center gap-2',
  title: 'text-lg',
  statsGrid: 'grid grid-cols-2 gap-3',
  statBox: 'rounded-lg bg-muted/50 p-3 text-center',
  statLabel:
    'flex items-center justify-center gap-1 text-sm text-muted-foreground',
  statValue: 'mt-1 text-2xl font-bold',
  statCapacity: 'text-sm font-normal text-muted-foreground',
  actionsRow: 'flex flex-wrap gap-2',
  actionButton: 'gap-1',
};

export const emptyStateStyles = {
  wrapper: 'flex flex-col items-center justify-center py-12',
  icon: 'mb-4 h-12 w-12 text-muted-foreground',
  text: 'text-muted-foreground',
  button: 'mt-4',
};
