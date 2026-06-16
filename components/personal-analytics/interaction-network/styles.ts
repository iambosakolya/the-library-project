export const interactionNetworkStyles = {
  emptyState: 'py-12 text-center text-muted-foreground',
  headerTitle: 'flex items-center gap-2',
  headerIcon: 'h-5 w-5 text-cyan-500',
  list: 'space-y-2',
  userRow:
    'flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50',
  avatarWrapper:
    'flex h-8 w-8 items-center justify-center rounded-full bg-muted',
  avatarImage: 'h-8 w-8 rounded-full object-cover',
  avatarFallback: 'h-5 w-5 text-muted-foreground',
  userContent: 'flex-1',
  userHeader: 'flex items-center justify-between',
  userName: 'text-sm font-medium',
  typeBadge: 'rounded-full px-2 py-0.5 text-xs',
  progressWrapper: 'mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted',
  progressBar: 'h-full rounded-full bg-cyan-500 transition-all',
  interactionCount: 'text-xs font-semibold text-muted-foreground',
};

export const TYPE_COLORS: Record<string, string> = {
  review_reply:
    'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
  club_member:
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  follower: 'bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300',
};
