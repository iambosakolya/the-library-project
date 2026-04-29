# Personal Reading Analytics Dashboard

## Overview

The Personal Reading Analytics Dashboard gives registered users a comprehensive view of their reading activity, community participation, and reading journey. It includes goal setting, achievement tracking, privacy controls, and data export capabilities.

## Features

### 1. Reading Activity Timeline

- Visualizes monthly activity across reviews, purchases, club memberships, and event attendance
- Filterable by period (month, 6 months, year)
- Area chart with color-coded series

### 2. Genre Preference Wheel

- Donut chart showing genre distribution based on purchases and reviews
- Purchases are weighted 2x for stronger signal
- Shows percentage breakdown

### 3. Review Writing Statistics

- Summary cards: total reviews, average rating, helpful votes received, replies received
- Rating distribution bar chart (1-5 stars)
- Monthly review activity

### 4. Club/Event Participation History

- Lists all clubs and events the user participates in
- Shows role (organizer vs member), status (active/ended), and attendance rate
- Sorted by most recent

### 5. Reading Streak Tracker

- Tracks consecutive days of reading activity
- Shows current streak and longest streak
- Motivational messages based on progress
- Fire icons for active streaks

### 6. Interaction Network

- Shows top 10 users you interact with most
- Interaction types: review replies, club co-members, followers
- Visual bar showing relative interaction strength

### 7. Year in Books Summary

- Annual summary with books purchased, reviews written, total spent, average rating
- Favorite genre, clubs joined, events attended
- Monthly activity chart
- Top-rated books list

### 8. Goal Setting & Tracking

- Set annual goals for: Books to Read, Reviews to Write, Events to Attend
- Progress bars with percentage completion
- Add/remove goals dynamically
- Auto-computed progress from actual activity

### 9. Achievement System

- 16 achievement types across categories:
  - **Reviews**: First Words, Critic in Training, Seasoned Reviewer, Review Master, Literary Sage
  - **Clubs**: Club Member, Social Reader
  - **Events**: Event Goer, Regular Attendee, Event Enthusiast
  - **Streaks**: Week Warrior, Monthly Devotion, Quarter Champion, Year of Reading
  - **Special**: Genre Explorer, Social Butterfly
- Visual grid with locked/unlocked states
- Auto-awarded on dashboard load

### 10. Privacy Controls

- Per-section visibility: Public, Friends Only, Private
- Sections: Profile Analytics, Reading Goals, Streak, Review Stats, Activity Timeline

### 11. Dashboard Customization

- Drag-and-drop widget reordering
- Show/hide individual widgets
- Layout persisted to database

### 12. Data Export

- Export all personal data as JSON
- Includes: user info, reviews, orders, goals, achievements, streak, participation, genre preferences, year in books

## Technical Architecture

### Database Models (Prisma)

- `ReadingGoal` - Goal tracking with type, target, year
- `ReadingStreak` - Streak tracking per user
- `UserAchievement` - Earned achievements
- `UserAnalyticsPreference` - Privacy settings and dashboard layout

### Server Actions (`lib/actions/personal-analytics.actions.ts`)

- In-memory cache (2-min TTL) for performance
- Auth-gated (requires session)
- Parallel data fetching via `Promise.all`

### API Routes

- `GET /api/personal-analytics?section=<name>&period=<period>` - Fetch analytics data
- `POST /api/personal-analytics/actions` - Goals CRUD, privacy updates, layout saving, streak updates

### UI Components (`components/personal-analytics/`)

- All lazy-loaded via `React.lazy` for code splitting
- Recharts for data visualization
- shadcn/ui for UI primitives
- Responsive design (mobile-first)

## Navigation

Access via: **User Menu → Account → Reading Dashboard** (`/user/reading-dashboard`)

## Privacy Compliance

- All data is user-owned and controlled
- Privacy settings default to appropriate levels (profile: public, goals: friends only)
- Full data export for GDPR compliance
- No tracking of other users' private data
