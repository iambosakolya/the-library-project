export const howItWorksStyles = {
  section:
    'relative overflow-hidden bg-secondary/30 py-24 dark:bg-secondary/10 md:py-32',
  bgPattern:
    'pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,hsl(var(--primary)/0.03),transparent_50%)]',
  container: 'relative px-6 md:px-12 xl:px-20 2xl:px-32',
  headingWrapper: 'mb-16 text-center',
  badge:
    'mb-3 inline-block rounded-full bg-background px-4 py-1 text-sm font-medium text-muted-foreground shadow-sm',
  title: 'text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl',
  grid: 'relative grid gap-8 md:grid-cols-4',
  timelineBar:
    'absolute left-0 right-0 top-[60px] z-0 hidden h-0.5 md:block',
  timelineGradient:
    'h-full w-full bg-gradient-to-r from-chart-1/40 via-chart-4/40 to-chart-3/40',
  stepCard: 'relative z-10 flex flex-col items-center text-center',
  stepTitle: 'mb-2 text-lg font-bold',
  stepDescription:
    'max-w-[220px] text-sm leading-relaxed text-muted-foreground',
};

export function stepBadgeClass(accent: string) {
  return `mb-5 flex h-[120px] w-[120px] flex-col items-center justify-center rounded-2xl border ${accent} shadow-sm transition-transform duration-300 hover:scale-105`;
}
