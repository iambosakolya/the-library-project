export const participantStyles = {
  wrapper: 'space-y-6',
  summaryRow:
    'flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between',
  badgeRow: 'flex gap-4',
  badgeText: 'text-sm',
};

export const messageDialogStyles = {
  content: 'sm:max-w-lg',
  formSection: 'space-y-4',
  inputGroup: 'space-y-2',
  textarea: 'min-h-32',
};

export const attendanceStyles = {
  headerRow:
    'flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between',
  titleIcon: 'h-5 w-5',
  sessionRow: 'flex items-center gap-2',
  sessionSelect: 'w-32',
  emptyText: 'py-8 text-center text-muted-foreground',
  participantList: 'space-y-3',
  participantCard:
    'flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between',
  userRow: 'flex items-center gap-3',
  avatar: 'rounded-full',
  avatarPlaceholder:
    'flex h-10 w-10 items-center justify-center rounded-full bg-muted',
  avatarIcon: 'h-5 w-5 text-muted-foreground',
  userName: 'font-medium',
  userEmail: 'flex items-center gap-1 text-sm text-muted-foreground',
  emailIcon: 'h-3 w-3',
  joinDate: 'text-xs text-muted-foreground',
  statusRow: 'flex items-center gap-2',
  statusLabel: 'mr-2 flex items-center gap-1 text-sm',
  statusButton: 'gap-1',
  statusIcon: 'h-3.5 w-3.5',
};

export const cancelledStyles = {
  title: 'text-sm font-medium',
  list: 'space-y-2',
  card: 'flex items-center gap-3 rounded-lg border border-dashed p-3 opacity-60',
  avatarSmall: 'rounded-full',
  avatarPlaceholderSmall:
    'flex h-8 w-8 items-center justify-center rounded-full bg-muted',
  avatarIconSmall: 'h-4 w-4 text-muted-foreground',
  info: 'flex-1',
  name: 'text-sm font-medium',
  email: 'text-xs text-muted-foreground',
  badge: 'text-xs',
};
