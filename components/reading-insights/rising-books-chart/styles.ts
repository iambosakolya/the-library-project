export const risingBooksStyles = {
  headerIcon: 'h-5 w-5 text-emerald-500',
  bookList: 'space-y-3',
  bookLink:
    'flex items-center gap-4 rounded-lg border p-3 transition-colors hover:bg-muted/50',
  bookRank:
    'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white',
  bookInfo: 'min-w-0 flex-1',
  bookName: 'truncate text-sm font-semibold',
  bookMeta: 'text-xs text-muted-foreground',
  statsWrapper: 'flex flex-shrink-0 items-center gap-3',
  statsValues: 'text-right',
  statsReviews: 'text-sm font-medium',
  statsSold: 'text-xs text-muted-foreground',
  growthPositive:
    'inline-flex items-center gap-0.5 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
  growthNegative:
    'inline-flex items-center gap-0.5 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900 dark:text-red-300',
  growthNeutral:
    'inline-flex items-center gap-0.5 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground',
  growthIcon: 'h-3 w-3',
};
