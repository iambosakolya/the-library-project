export const headerStyles = {
  root: 'w-full border-b',
  wrapper:
    'wrapper flex flex-wrap items-center justify-between gap-2 sm:gap-4',
  left: 'flex items-center flex-1 min-w-0',
  logoLink: 'ml-2 sm:ml-4 flex items-start min-w-0',
  icon: 'w-8 h-8 sm:w-12 sm:h-12 md:w-14 md:h-14 flex-shrink-0',
  logoTextWrapper: 'ml-2 sm:ml-4 min-w-0',
  appName:
    'block text-base sm:text-xl md:text-2xl font-bold truncate',
  tagline:
    'hidden sm:block text-xs md:text-sm lg:text-base text-muted-foreground',
  searchWrapper: 'hidden md:block flex-1 max-w-md',
  actions: 'space-x-2 flex-shrink-0',
} as const;

