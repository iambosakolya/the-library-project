export const RANK_STYLES: Record<number, string> = {
  1: 'bg-amber-500 text-white',
  2: 'bg-gray-400 text-white',
  3: 'bg-amber-700 text-white',
};

export const topBooksRankingStyles = {
  emptyState: 'py-12 text-center text-muted-foreground',
  headerTitle: 'flex items-center gap-2',
  headerIcon: 'h-5 w-5 text-amber-500',
  list: 'space-y-2',
  bookLink:
    'group flex items-center gap-3 rounded-lg border p-2.5 transition-all hover:bg-accent/50 hover:shadow-md',
  rankBadge:
    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold',
  rankDefault: 'bg-muted text-muted-foreground',
  coverWrapper: 'relative h-12 w-9 shrink-0 overflow-hidden rounded bg-muted',
  coverImage: 'object-cover',
  infoWrapper: 'min-w-0 flex-1',
  bookTitle:
    'line-clamp-1 text-sm font-semibold transition-colors group-hover:text-primary',
  author: 'text-xs text-muted-foreground',
  statsWrapper: 'shrink-0 text-right',
  salesBadge: 'text-[10px]',
  ratingText: 'mt-0.5 text-xs text-muted-foreground',
};
