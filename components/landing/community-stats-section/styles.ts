export const communityStatsStyles = {
  section: 'relative py-24 md:py-32',
  bgAccent:
    'pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.03),transparent_70%)]',
  container: 'relative px-6 md:px-12 xl:px-20 2xl:px-32',
  headingWrapper: 'mb-16 text-center',
  badge:
    'mb-3 inline-block rounded-full bg-secondary px-4 py-1 text-sm font-medium text-muted-foreground',
  title: 'text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl',
  gradientText:
    'bg-gradient-to-r from-chart-2 to-chart-3 bg-clip-text text-transparent',
  grid: 'grid gap-6 sm:grid-cols-2 lg:grid-cols-4',
};

export const statCardStyles = {
  card: 'flex flex-col items-center rounded-2xl border bg-card p-8 shadow-sm transition-shadow hover:shadow-lg',
  iconWrapper: 'mb-4 rounded-xl bg-secondary p-3',
  value: 'text-4xl font-bold tabular-nums tracking-tight',
  label: 'mt-1 text-sm text-muted-foreground',
};
