import type { Period } from '@/components/community/period-filter/period-filter';

export interface ClubBook {
  id: string;
  name: string;
  slug: string;
  author: string;
  category: string;
  image: string;
  rating: number;
  clubAppearances: number;
}

export interface GenreBreakdownItem {
  genre: string;
  count: number;
}

export interface ClubPreferencesProps {
  topBooks: ClubBook[];
  genreBreakdown: GenreBreakdownItem[];
  clubCount: number;
}

export interface TreemapContentProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  name?: string;
  value?: number;
  index?: number;
}

export interface ComparisonData {
  mostDiscussed: { name: string; reviewCount: number }[];
  authorSpotlight: { author: string; totalReviews: number }[];
  risingBooks: { name: string; recentReviews: number; recentSales: number }[];
}

export interface GenreFilterProps {
  genres: string[];
  value: string;
  onChange: (genre: string) => void;
}

export interface ExportChartButtonProps {
  chartRef: React.RefObject<HTMLDivElement | null>;
  filename?: string;
}

export type { Period };
