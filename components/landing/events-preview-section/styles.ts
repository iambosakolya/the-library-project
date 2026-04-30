export const eventsPreviewStyles = {
  section:
    'relative overflow-hidden bg-secondary/30 py-24 dark:bg-secondary/10 md:py-32',
  container: 'relative px-6 md:px-12 xl:px-20 2xl:px-32',
  headingWrapper:
    'mb-12 flex flex-col items-center gap-4 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left',
  badge:
    'mb-3 inline-block rounded-full bg-background px-4 py-1 text-sm font-medium text-muted-foreground shadow-sm',
  title: 'text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl',
  gradientText:
    'bg-gradient-to-r from-chart-4 to-chart-2 bg-clip-text text-transparent',
  buttonsRow: 'flex gap-3',
  buttonLink: 'group gap-2',
  tabsWrapper: 'mb-8 flex justify-center gap-2',
  tabActive:
    'rounded-full px-5 py-2 text-sm font-medium transition-colors bg-primary text-primary-foreground shadow-sm',
  tabInactive:
    'rounded-full px-5 py-2 text-sm font-medium transition-colors bg-secondary text-muted-foreground hover:text-foreground',
  grid: 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3',
  dotsWrapper: 'mt-8 flex items-center justify-center gap-4',
  navButton:
    'rounded-full border bg-background p-2 transition-colors hover:bg-secondary',
  dotsInner: 'flex gap-2',
  dotActive: 'h-2 w-6 rounded-full bg-primary transition-all',
  dotInactive: 'h-2 w-2 rounded-full bg-muted-foreground/30 transition-all',
  emptyState: 'rounded-2xl border bg-card p-12 text-center',
  emptyIcon: 'mx-auto mb-4 h-12 w-12 text-muted-foreground/30',
  emptyTitle: 'mb-2 text-lg font-bold',
  emptyText: 'text-muted-foreground',
  emptyLink: 'text-primary underline',
};

export const cardStyles = {
  wrapper:
    'group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-shadow hover:shadow-lg',
  header: 'relative flex h-36 items-end p-5',
  badge: 'rounded-full px-3 py-0.5 text-xs font-semibold',
  body: 'flex flex-1 flex-col p-5',
  title: 'mb-3 text-lg font-bold leading-snug hover:underline',
  description: 'mb-3 line-clamp-2 text-sm text-muted-foreground',
  metaWrapper: 'mt-auto space-y-2 text-sm text-muted-foreground',
  metaRow: 'flex items-center gap-2',
  metaIcon: 'h-4 w-4 shrink-0',
};
