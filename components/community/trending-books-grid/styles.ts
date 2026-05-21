export const trendingBooksGridStyles = {
  emptyState: 'py-12 text-center text-muted-foreground',
  headerTitle: 'flex items-center gap-2',
  headerIcon: 'h-5 w-5 text-orange-500',
  grid: 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4',
  bookCard:
    'group relative flex flex-col rounded-lg border bg-card p-3 transition-all hover:-translate-y-0.5 hover:shadow-lg',
  topBadge: 'absolute -right-2 -top-2 z-10 bg-orange-500 text-xs text-white',
  imageWrapper:
    'relative mb-3 aspect-[3/4] w-full overflow-hidden rounded-md bg-muted',
  bookImage: 'object-cover transition-transform group-hover:scale-105',
  bookTitle:
    'line-clamp-2 text-sm font-semibold transition-colors group-hover:text-primary',
  author: 'mt-0.5 text-xs text-muted-foreground',
  priceRow: 'mt-2 flex items-center justify-between text-xs',
  price: 'font-medium',
  rating: 'text-muted-foreground',
  badgeRow: 'mt-1.5 flex gap-2',
  soldBadge: 'text-[10px]',
  reviewBadge: 'text-[10px]',
};
