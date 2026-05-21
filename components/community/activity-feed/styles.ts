export const badgeVariantMap: Record<
  string,
  'default' | 'secondary' | 'outline'
> = {
  review: 'default',
  registration: 'secondary',
  purchase: 'outline',
};

export const activityFeedStyles = {
  emptyState: 'py-12 text-center text-muted-foreground',
  headerTitle: 'flex items-center gap-2',
  headerIcon: 'h-5 w-5 text-violet-500',
  scrollArea: 'h-[360px] pr-3',
  feedList: 'space-y-3',
  feedItem:
    'flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50',
  itemIconWrapper: 'mt-0.5',
  itemIcon: 'h-4 w-4',
  itemContent: 'min-w-0 flex-1',
  itemTitle: 'truncate text-sm font-medium leading-tight',
  itemDescription: 'mt-0.5 truncate text-xs text-muted-foreground',
  itemMeta: 'flex shrink-0 flex-col items-end gap-1',
  badge: 'px-1.5 py-0 text-[10px]',
  timeText: 'whitespace-nowrap text-[10px] text-muted-foreground',
};
