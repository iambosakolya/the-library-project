# Admin Analytics & Dashboard Documentation

## Overview

The Admin Analytics system provides administrators with a comprehensive overview of platform performance, including revenue tracking, sales trends, user growth, product catalog metrics, book submission SLA monitoring, and club/event request management. All analytics are restricted to users with `role: 'admin'`.

## Features

### Core Functionality

1. **Revenue & Sales Dashboard** — Real-time revenue totals, order counts, and monthly sales trend chart
2. **Customer & Product Counts** — Total registered users and catalog size at a glance
3. **Monthly Sales Chart** — Recharts `BarChart` visualization of revenue grouped by month
4. **Recent Sales Feed** — Last 6 orders with buyer details and totals
5. **Book Submission SLA Tracking** — Pending submission counts with on-time, recent, and overdue breakdowns
6. **Club/Event Request Stats** — Pending request counts segmented by type (club vs event)

## Access & Permissions

### Admin Only

- Only users with `role: 'admin'` can access analytics
- Route: `/admin/overview` (main dashboard)
- Route: `/admin/book-submissions` (SLA metrics)
- Route: `/admin/requests` (request stats)
- Unauthorized access redirects to the home page

## Page Structure

### 1. Overview Dashboard (`/admin/overview`)

**File**: `app/admin/overview/page.tsx`

#### Summary Cards

Four metric cards displayed at the top of the dashboard:

| Metric        | Icon              | Description                           |
| ------------- | ----------------- | ------------------------------------- |
| Total Revenue | `BadgeDollarSign` | Sum of all `totalPrice` across orders |
| Sales         | `CreditCardIcon`  | Total number of orders placed         |
| Customers     | `User2Icon`       | Total registered users                |
| Products      | `BookIcon`        | Total products in catalog             |

Each card shows:

- Label and icon
- Formatted value (currency for revenue, plain number for counts)

#### Monthly Sales Chart

**Component**: `app/admin/overview/charts.tsx`

- **Library**: Recharts (`BarChart`, `Bar`, `XAxis`, `YAxis`, `ResponsiveContainer`)
- **Data**: Monthly revenue aggregated by `to_char("createdAt", 'MM/YY')`
- **Axes**: X-axis = month label (`MM/YY`), Y-axis = total sales ($)
- **Rendering**: Full-width responsive container

```typescript
type SalesDataPoint = {
  month: string; // e.g. "01/26"
  totalSales: number;
};
```

#### Recent Sales Table

Displays the last 6 orders:

| Column     | Description                         |
| ---------- | ----------------------------------- |
| Buyer Name | User's name from the order relation |
| Date       | Order creation timestamp            |
| Total      | Formatted order total price         |
| Link       | Direct link to order detail page    |

### 2. Book Submission SLA Metrics (`/admin/book-submissions`)

**File**: `app/admin/book-submissions/page.tsx`

#### SLA Summary Cards

Four metric cards:

| Metric        | Icon            | Color   | Description                              |
| ------------- | --------------- | ------- | ---------------------------------------- |
| Total Pending | `BookOpen`      | Default | All submissions with `status: 'pending'` |
| On Time       | `CheckCircle`   | Green   | Pending submissions within 3-day SLA     |
| Recent        | `Clock`         | Blue    | Submitted within the last 24 hours       |
| Overdue       | `AlertTriangle` | Red     | Pending for more than 3 days             |

#### SLA Status Indicators

Each individual submission card shows a colored SLA badge:

| Threshold   | Color  | Label            |
| ----------- | ------ | ---------------- |
| < 24 hours  | Green  | On Time          |
| 24–72 hours | Yellow | Attention Needed |
| > 72 hours  | Red    | Overdue          |

#### Overdue Alert Banner

A destructive `Alert` component appears at the top of the page when `overduePending > 0`, drawing immediate attention to submissions that have exceeded the SLA window.

### 3. Club/Event Request Stats (`/admin/requests`)

**File**: `app/admin/requests/page.tsx`

Three inline stat cards:

| Metric           | Calculation                                      |
| ---------------- | ------------------------------------------------ |
| Pending Requests | Total count of requests with `status: 'pending'` |
| Club Requests    | Filtered count where `type: 'club'`              |
| Event Requests   | Filtered count where `type: 'event'`             |

## Server Actions

### `getOrderSummary()`

**File**: `lib/actions/order.actions.ts`

Aggregates all admin dashboard data in a single call:

```typescript
type OrderSummary = {
  ordersCount: number;
  productsCount: number;
  usersCount: number;
  totalSales: { _sum: { totalPrice: number } };
  salesData: { month: string; totalSales: number }[];
  latestSales: Order[];
};
```

**Queries performed:**

1. `prisma.order.count()` — total orders
2. `prisma.product.count()` — total products
3. `prisma.user.count()` — total users
4. `prisma.order.aggregate({ _sum: { totalPrice: true } })` — revenue sum
5. Raw SQL: `SELECT to_char("createdAt", 'MM/YY') as "month", sum("totalPrice") as "totalSales" FROM "Order" GROUP BY ...` — monthly breakdown
6. `prisma.order.findMany({ take: 6, orderBy: { createdAt: 'desc' } })` — recent sales

### `getBookSubmissionSLAMetrics()`

**File**: `lib/actions/book-submission.actions.ts`

Returns SLA breakdown for pending book submissions:

```typescript
type SLAMetrics = {
  totalPending: number;
  overduePending: number; // > 72 hours old
  recentPending: number; // < 24 hours old
  onTimePending: number; // within 3-day window
};
```

**Queries**: Three parallel `prisma.bookSubmission.count()` calls with time-based `createdAt` filters.

### `getPendingClubRequests()`

**File**: `lib/actions/club-request.actions.ts`

Returns all club/event requests with `status: 'pending'`, including creator details. Stats are computed client-side by filtering on `type` and `status`.

## Data Flow

```
Browser → /admin/overview
         → Server Component (page.tsx)
           → getOrderSummary()
             → Prisma aggregates + raw SQL
           → Renders summary cards + Charts component + recent sales table

Browser → /admin/book-submissions
         → Server Component (page.tsx)
           → getBookSubmissionSLAMetrics()
             → 3× parallel Prisma counts
           → Renders SLA cards + overdue alert + submission list

Browser → /admin/requests
         → Server Component (page.tsx)
           → getPendingClubRequests()
             → Prisma findMany
           → Client-side count filtering → stat cards
```

## Chart Library

- **Recharts** (`recharts` v2.x) is used for all admin chart visualizations
- The `Charts` component uses `ResponsiveContainer` for fluid sizing
- `BarChart` renders the monthly sales trend with the `fill` color set to the CSS `--primary` variable
- Charts are rendered client-side (`'use client'`) while data is fetched server-side

## Key Files

| File                                     | Purpose                                       |
| ---------------------------------------- | --------------------------------------------- |
| `app/admin/overview/page.tsx`            | Main admin dashboard page (server component)  |
| `app/admin/overview/charts.tsx`          | Monthly sales bar chart (client component)    |
| `app/admin/book-submissions/page.tsx`    | Book submission SLA dashboard                 |
| `app/admin/requests/page.tsx`            | Club/event request stats                      |
| `lib/actions/order.actions.ts`           | `getOrderSummary()` server action             |
| `lib/actions/book-submission.actions.ts` | `getBookSubmissionSLAMetrics()` server action |
| `lib/actions/club-request.actions.ts`    | `getPendingClubRequests()` server action      |
