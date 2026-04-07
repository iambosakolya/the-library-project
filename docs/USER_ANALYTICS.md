# User & Community Analytics Documentation

## Overview

The User & Community Analytics system provides public-facing analytics dashboards and user profile statistics across the LibProj platform. It includes a comprehensive community dashboard with interactive charts, trending book rankings, genre popularity, activity feeds, and individual user profile statistics visible to all members.

## Features

### Core Functionality

1. **Community Dashboard** — Centralized analytics page with real-time community metrics
2. **Reading Trends Chart** — Area chart showing purchase and review trends over time
3. **Trending Books Grid** — Weighted ranking of popular books based on sales and reviews
4. **Genre Cloud** — Interactive word cloud showing genre popularity by book count and revenue
5. **Top Books Ranking** — Ranked list of best-selling books for the selected period
6. **Active Clubs & Upcoming Events** — Lists of current clubs and future events with participation metrics
7. **Activity Feed & Ticker** — Real-time stream of recent platform activity (reviews, registrations, purchases)
8. **Period Filtering** — Switch all analytics between week, month, and year timeframes
9. **User Profile Stats** — Per-user metrics (reviews, clubs, followers, events)
10. **Landing Page Stats** — Animated counters showing platform-wide numbers

## Access & Permissions

### Public Access

- Community dashboard: `/community` — accessible to all visitors
- User profiles: `/profile/[id]` — accessible to all visitors
- Landing page stats: `/` — accessible to all visitors

### Authenticated Features

- Following/unfollowing users requires authentication
- Some activity feed items link to authenticated-only pages

## Page Structure

### 1. Community Dashboard (`/community`)

**Server Page**: `app/(root)/community/page.tsx`
**Client Orchestrator**: `app/(root)/community/community-dashboard-client.tsx`
**API Route**: `GET /api/community?section={name}&period={week|month|year}`

#### Architecture

The page uses a hybrid server/client pattern:

1. **Server-side**: Initial data fetch via 8 parallel server action calls
2. **Client-side**: Period changes trigger a `GET /api/community` fetch for updated data
3. **In-memory cache**: All server actions use a 5-minute TTL cache to reduce database load

#### CommunityData Type

```typescript
interface CommunityData {
  stats: {
    totalBooks: number;
    totalMembers: number;
    activeClubs: number;
    upcomingEvents: number;
    totalReviews: number;
    totalOrders: number;
  };
  trending: TrendingBook[];
  clubs: ClubData[];
  events: EventData[];
  genres: GenreData[];
  feed: FeedItemServer[];
  topBooks: TopBook[];
  trends: {
    purchases: DateCount[];
    reviews: DateCount[];
  };
}
```

---

### 1A. Community Stats Bar

**Component**: `components/community/community-stats-bar.tsx`

Six stat cards in a responsive grid (2 → 3 → 6 columns):

| Metric          | Icon          | Color  |
| --------------- | ------------- | ------ |
| Total Books     | `BookOpen`    | Blue   |
| Members         | `Users`       | Green  |
| Active Clubs    | `Library`     | Purple |
| Upcoming Events | `Calendar`    | Orange |
| Total Reviews   | `Star`        | Yellow |
| Total Orders    | `ShoppingBag` | Pink   |

---

### 1B. Reading Trends Chart

**Component**: `components/community/reading-trends-chart.tsx`

- **Library**: Recharts (`AreaChart`, `Area`, `CartesianGrid`, `Tooltip`, `Legend`)
- **Series**: Two area series — Purchases (indigo with gradient fill) and Reviews (green with gradient fill)
- **Lazy-loaded**: Uses `React.lazy` for code-splitting
- **Data**: Time-series points `{ date: string, count: number }` for both series

```typescript
type TrendsData = {
  purchases: { date: string; count: number }[];
  reviews: { date: string; count: number }[];
};
```

---

### 1C. Trending Books Grid

**Component**: `components/community/trending-books-grid.tsx`

- Displays top trending books in a 4-column grid
- Each card shows: cover image, title, author, star rating, "X sold" badge, "X new reviews" badge
- Top 3 books receive numbered orange rank badges
- Weighted scoring: `(totalSold × 3) + (recentReviews × 2) + numReviews`

```typescript
type TrendingBook = {
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
};
```

---

### 1D. Genre Cloud

**Component**: `components/community/genre-cloud.tsx`

- Interactive word cloud with font sizes proportional to `bookCount / maxCount`
- Hover tooltip shows: "Genre: X books · $Y revenue"
- 10-color rotation for visual diversity
- Data sourced from order history grouped by product category

```typescript
type GenreData = {
  genre: string;
  bookCount: number;
  revenue: number;
};
```

---

### 1E. Top Books Ranking

**Component**: `components/community/top-books-ranking.tsx`

- Ranked list of best-selling books for the selected period
- Gold (#1), silver (#2), bronze (#3) colored rank badges
- Each entry shows: rank, cover image, title, author, star rating, "X sold" badge
- Period label dynamically reflects the selected timeframe

```typescript
type TopBook = {
  rank: number;
  id: string;
  name: string;
  slug: string;
  author: string;
  image: string;
  price: number;
  rating: number;
  totalSold: number;
};
```

---

### 1F. Active Clubs List

**Component**: `components/community/active-clubs-list.tsx`

- 3-column grid of active reading club cards
- Each card shows: title, purpose, member count / capacity, book count, format badge (online/in-person), creator name, active registrations

```typescript
type ClubData = {
  id: string;
  title: string;
  purpose: string;
  description: string;
  memberCount: number;
  capacity: number;
  format: 'online' | 'offline';
  startDate: Date;
  bookCount: number;
  creatorName: string;
  activeRegistrations: number;
};
```

---

### 1G. Upcoming Events

**Component**: `components/community/upcoming-events-calendar.tsx`

- Date-block layout with month/day visual blocks
- Each entry shows: title, time, attendee count / capacity, book count, organizer name, format badge

```typescript
type EventData = {
  id: string;
  title: string;
  description: string;
  eventDate: Date;
  capacity: number;
  format: 'online' | 'offline';
  attendeeCount: number;
  organizerName: string;
  bookCount: number;
};
```

---

### 1H. Activity Feed

**Component**: `components/community/activity-feed.tsx`

- Scrollable list of recent platform activity
- Three activity types with distinct icons and colors:

| Type           | Icon        | Description                 |
| -------------- | ----------- | --------------------------- |
| `review`       | Star        | New book review submitted   |
| `registration` | UserPlus    | New club/event registration |
| `purchase`     | ShoppingBag | New book purchase           |

- Each item shows: type badge, title, description, relative time ("2 hours ago")

---

### 1I. Activity Ticker

**Component**: `components/community/activity-ticker.tsx`

- Horizontally auto-scrolling marquee strip at the top of the community page
- Shows the latest 10 activity items
- Pauses on hover
- Uses `requestAnimationFrame` for smooth continuous scrolling

---

### 1J. Period Filter

**Component**: `components/community/period-filter.tsx`

- Dropdown select with calendar icon
- Options: `week`, `month`, `year`
- Controls all period-dependent sections (trends, trending books, genres, top books)
- Triggers client-side API re-fetch on change

---

### 2. User Profile Analytics (`/profile/[id]`)

**Page**: `app/(root)/profile/[id]/page.tsx`
**Data Source**: `getUserPublicProfile(userId)` in `lib/actions/user.actions.ts`

#### Profile Metrics

| Metric            | Source                                     |
| ----------------- | ------------------------------------------ |
| Followers         | `user._count.followers`                    |
| Following         | `user._count.following`                    |
| Total Reviews     | `user._count.reviews`                      |
| Active Clubs      | Derived from registrations + created clubs |
| Organized Events  | `user.organizedEvents`                     |
| Registered Events | From `user.registrations`                  |
| Member Since      | `user.createdAt`                           |

#### Reviews Section

- Last 10 reviews displayed with star ratings, book title, and review text
- Separate reviews page at `/profile/[id]/reviews`

---

### 3. Landing Page Stats (`/`)

**Component**: `components/landing/community-stats-section.tsx`
**Data Source**: `getLandingPageData()` in `lib/actions/landing.actions.ts`

Four animated counter cards with scroll-triggered count-up animation:

| Metric               | Icon            | Source                                              |
| -------------------- | --------------- | --------------------------------------------------- |
| Active Reading Clubs | `BookOpen`      | `prisma.readingClub.count({ isActive: true })`      |
| Books Discussed      | `Users`         | Unique `bookIds` across all active clubs and events |
| Events Hosted        | `CalendarCheck` | `prisma.event.count({ isActive: true })`            |
| Community Members    | `Globe`         | `prisma.user.count()`                               |

**Animation hooks:**

- `useCountUp(end, duration, start)` — ease-out cubic count-up via `requestAnimationFrame`
- `useIntersection(options?)` — `IntersectionObserver` triggers animation when section scrolls into view

---

## Server Actions

### Community Analytics (`lib/actions/public-analytics.actions.ts`)

All functions use a 5-minute in-memory TTL cache to reduce database load.

| Function                          | Returns                                                             | Query Type                                                                |
| --------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `getCommunityStats()`             | 6 aggregate counts (books, members, clubs, events, reviews, orders) | 6× parallel `prisma.*.count()`                                            |
| `getTrendingBooks(period, limit)` | Weighted trending books                                             | Raw SQL join: `Product` + `OrderItem` + `Review`                          |
| `getTopBooks(period, limit)`      | Best-sellers by quantity sold                                       | Raw SQL: `SUM(OrderItem.quantity)` grouped by product                     |
| `getGenrePopularity(period)`      | Genre breakdown by count and revenue                                | Raw SQL: `GROUP BY product.category`                                      |
| `getReadingTrendsPublic(period)`  | Daily purchase and review counts                                    | 2× raw SQL: `GROUP BY DATE("createdAt")`                                  |
| `getActiveClubs(limit)`           | Active reading clubs with registration counts                       | `prisma.readingClub.findMany` + nested counts                             |
| `getUpcomingEvents(limit)`        | Future events with attendee counts                                  | `prisma.event.findMany` where `eventDate >= now`                          |
| `getActivityFeed(limit)`          | Merged activity stream                                              | 3× parallel queries (reviews, registrations, orders), sorted by timestamp |

### Landing Page Stats (`lib/actions/landing.actions.ts`)

| Function               | Returns                            | Query Type                 |
| ---------------------- | ---------------------------------- | -------------------------- |
| `getLandingPageData()` | Events, clubs, and aggregate stats | 6+ parallel Prisma queries |

### User Profile (`lib/actions/user.actions.ts`)

| Function                       | Returns                                | Query Type                                           |
| ------------------------------ | -------------------------------------- | ---------------------------------------------------- |
| `getUserPublicProfile(userId)` | User details with counts and relations | `prisma.user.findUnique` with `_count` and `include` |

## Community API Route

**Route**: `GET /api/community`

**File**: `app/api/community/route.ts`

**Query Parameters:**
| Param | Values | Description |
|---|---|---|
| `section` | `trending`, `clubs`, `events`, `genres`, `feed`, `top-books`, `stats`, `trends`, `all` | Which data section to fetch |
| `period` | `week`, `month`, `year` | Time range for period-dependent sections |

**Purpose**: Client-side data refresh when the user changes the period filter. Delegates to the same server actions used for initial server-side rendering.

## Data Flow

```
Community Dashboard:
  Browser → /community
           → Server Component (page.tsx)
             → 8× parallel server action calls (with TTL cache)
           → CommunityDashboardClient (client component)
             → Renders all sub-components with initial data
             → Period change → GET /api/community?section=all&period=X
               → Server actions (cache-aware)
             → Re-renders affected components

Landing Page:
  Browser → /
           → Server Component (page.tsx)
             → getLandingPageData()
           → CommunityStatsSection (client, animated counters)
           → EventsPreviewSection (client, carousel)

User Profile:
  Browser → /profile/[id]
           → Server Component (page.tsx)
             → getUserPublicProfile(userId)
           → Renders metric cards + review list
```

## Chart Library

- **Recharts** (`recharts` v2.x) is used for the community trends area chart
- The `AreaChart` uses gradient fills (`defs` > `linearGradient`) for visual polish
- Charts are lazy-loaded via `React.lazy` for bundle optimization
- All chart components are `'use client'` while data is fetched server-side

## Caching Strategy

All community analytics server actions implement a simple in-memory TTL cache:

```typescript
const cache: Record<string, { data: unknown; timestamp: number }> = {};
const TTL = 5 * 60 * 1000; // 5 minutes

function getCached<T>(key: string): T | null {
  const entry = cache[key];
  if (entry && Date.now() - entry.timestamp < TTL) return entry.data as T;
  return null;
}
```

This prevents excessive database queries when multiple users load the community page within the same 5-minute window.

## Key Files

| File                                                  | Purpose                                |
| ----------------------------------------------------- | -------------------------------------- |
| `app/(root)/community/page.tsx`                       | Community dashboard server page        |
| `app/(root)/community/community-dashboard-client.tsx` | Client-side dashboard orchestrator     |
| `app/api/community/route.ts`                          | Community API route for client refresh |
| `components/community/community-stats-bar.tsx`        | 6-stat summary bar                     |
| `components/community/reading-trends-chart.tsx`       | Area chart (purchases + reviews)       |
| `components/community/trending-books-grid.tsx`        | Trending books card grid               |
| `components/community/genre-cloud.tsx`                | Interactive genre word cloud           |
| `components/community/top-books-ranking.tsx`          | Best-sellers ranked list               |
| `components/community/active-clubs-list.tsx`          | Active clubs card grid                 |
| `components/community/upcoming-events-calendar.tsx`   | Upcoming events list                   |
| `components/community/activity-feed.tsx`              | Scrollable activity stream             |
| `components/community/activity-ticker.tsx`            | Auto-scrolling activity marquee        |
| `components/community/period-filter.tsx`              | Week/month/year dropdown               |
| `components/landing/community-stats-section.tsx`      | Landing page animated counters         |
| `components/landing/events-preview-section.tsx`       | Landing page events/clubs carousel     |
| `app/(root)/profile/[id]/page.tsx`                    | Public user profile with stats         |
| `lib/actions/public-analytics.actions.ts`             | All community analytics server actions |
| `lib/actions/landing.actions.ts`                      | Landing page data server action        |
| `lib/actions/user.actions.ts`                         | User profile data server action        |
