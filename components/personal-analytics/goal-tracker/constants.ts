import {
  type LucideIcon,
  BookOpen,
  PenTool,
  CalendarCheck,
} from 'lucide-react';

export const TYPE_CONFIG: Record<string, { label: string; icon: LucideIcon }> =
  {
    books_to_read: { label: 'Books to Read', icon: BookOpen },
    reviews_to_write: { label: 'Reviews to Write', icon: PenTool },
    events_to_attend: { label: 'Events to Attend', icon: CalendarCheck },
  };
