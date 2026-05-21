export interface ClubData {
  id: string;
  title: string;
  purpose: string;
  description: string;
  memberCount: number;
  capacity: number;
  format: string;
  startDate: string;
  bookCount: number;
  creatorName: string;
  activeRegistrations: number;
}

export interface ActivityItem {
  type: 'review' | 'registration' | 'purchase';
  title: string;
  description: string;
  createdAt: string;
}

export interface StatsData {
  totalBooks: number;
  totalMembers: number;
  activeClubs: number;
  upcomingEvents: number;
  totalReviews: number;
  totalOrders: number;
}

export interface GenreData {
  genre: string;
  bookCount: number;
  revenue: number;
}

export interface TrendsData {
  purchases: { date: string; count: number }[];
  reviews: { date: string; count: number }[];
}

export interface TopBook {
  rank: number;
  id: string;
  name: string;
  slug: string;
  author: string;
  image: string;
  price: number;
  rating: number;
  totalSold: number;
}

export interface TrendingBook {
  id: string;
  name: string;
  slug: string;
  author: string;
  category: string;
  image: string;
  price: number;
  rating: number;
  numReviews: number;
  totalSold: number;
  recentReviews: number;
}

export interface EventData {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  capacity: number;
  format: string;
  attendeeCount: number;
  organizerName: string;
  bookCount: number;
}
