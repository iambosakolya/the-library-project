export const detailsStyles = {
  wrapper: 'space-y-6',
  headerBadges: 'mb-2 flex flex-wrap gap-2',
  title: 'text-3xl',
  infoGrid: 'grid gap-4 md:grid-cols-2',
  infoRow: 'flex items-center gap-2 text-sm',
  infoRowStart: 'flex items-start gap-2 text-sm md:col-span-2',
  infoIcon: 'h-4 w-4 text-muted-foreground',
  infoIconTop: 'mt-0.5 h-4 w-4 text-muted-foreground',
  infoLabel: 'font-medium',
  seatsAvailable: 'ml-2 text-green-600',
  seatsFull: 'ml-2 text-red-600',
  linkPrimary: 'text-primary hover:underline',
  organizerImage: 'rounded-full',
  descriptionText: 'text-muted-foreground',
  purposeText: 'text-muted-foreground',
  detailedDescription: 'whitespace-pre-wrap text-muted-foreground',
};

export const bookCardStyles = {
  grid: 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3',
  card: 'flex gap-3 rounded-lg border p-3 transition-shadow hover:shadow-md',
  imageWrapper: 'relative h-24 w-16 flex-shrink-0 overflow-hidden rounded',
  infoWrapper: 'flex flex-col gap-1',
  bookTitle: 'line-clamp-2 font-medium',
  bookAuthor: 'text-sm text-muted-foreground',
};
