export const featuresStyles = {
  section: 'relative py-24 md:py-32',
  container: 'px-6 md:px-12 xl:px-20 2xl:px-32',
  headingWrapper: 'mb-16 text-center',
  badge:
    'mb-3 inline-block rounded-full bg-secondary px-4 py-1 text-sm font-medium text-muted-foreground',
  title: 'text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl',
  subtitle: 'mx-auto mt-4 max-w-2xl text-lg text-muted-foreground',
  grid: 'grid gap-6 sm:grid-cols-2 lg:grid-cols-4',
};

export const featureCardStyles = {
  card: 'group relative overflow-hidden rounded-2xl border bg-card p-8 shadow-sm transition-shadow duration-300 hover:shadow-xl',
  gradientBg: 'absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100',
  content: 'relative z-10',
  iconBox:
    'mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-secondary transition-colors duration-300 group-hover:bg-background',
  title: 'mb-2 text-xl font-bold',
  description: 'leading-relaxed text-muted-foreground',
};
