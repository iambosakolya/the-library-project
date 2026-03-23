# AI-Powered Review Summary - Implementation Summary

## Overview

AI-powered review summaries for books with 10 or more reviews. Uses Google Gemini 2.5 Flash via the Vercel AI SDK to analyze reader reviews and produce structured sentiment analysis, positive/negative aspects, key themes, and a concise summary. Summaries are generated on demand when a user clicks "View AI Summary" on a product page, cached in the database, and refreshed daily via a cron endpoint. All summaries are clearly labelled as "AI-generated."

## Architecture

```
User clicks "View AI Summary"
        ↓
ReviewSummary component (client)
        ↓
getReviewSummary() server action
        ↓
  ┌─ Cached summary exists and is fresh? → Return from DB
  │
  └─ No summary / stale? → generateReviewSummary()
                                    ↓
                           Fetch up to 50 reviews from DB
                                    ↓
                           Build prompt → Google Gemini API
                                    ↓
                           Parse JSON response
                                    ↓
                           Upsert into ReviewSummary table
                                    ↓
                           Return to client → Render card

Daily cron:
  POST /api/review-summaries (Bearer token)
        ↓
  refreshAllSummaries() → iterates qualifying products → regenerates stale summaries
```

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| AI Model | Google Gemini 2.5 Flash | Structured review analysis |
| AI SDK | `ai` (Vercel AI SDK) | `generateText` for non-streaming JSON output |
| Provider | `@ai-sdk/google` | Google Gemini integration |
| Database | Prisma + PostgreSQL | `ReviewSummary` model for caching |
| UI | React client component | Button-triggered summary card |

## Database Schema

```prisma
model ReviewSummary {
  id              String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  productId       String   @unique @db.Uuid
  sentiment       String            // "positive" | "negative" | "mixed"
  positiveAspects String[]          // 2-5 short phrases
  negativeAspects String[]          // 2-5 short phrases
  themes          String[]          // 2-5 key themes
  summaryText     String            // 2-3 sentence neutral summary
  reviewCount     Int               // number of reviews used to generate
  generatedAt     DateTime          // when the AI last ran
  createdAt       DateTime
  updatedAt       DateTime
  product         Product  @relation(...)
}
```

One-to-one relationship with `Product`. The `productId` column has a unique constraint so each book has at most one cached summary.

## Files

### New Files

| File | Purpose |
|------|---------|
| `lib/actions/review-summary.actions.ts` | Server actions: generate, get, and bulk-refresh summaries |
| `components/shared/product/review-summary.tsx` | Client component: button + summary card UI |
| `app/api/review-summaries/route.ts` | Cron-compatible POST endpoint for daily refresh |

### Modified Files

| File | Change |
|------|--------|
| `prisma/schema.prisma` | Added `ReviewSummary` model and relation on `Product` |
| `app/(root)/product/[slug]/page.tsx` | Renders `<ReviewSummary>` with `productId` and `numReviews` props |

## Features

### 1. On-Demand Generation

Summaries are **not** generated on page load. Instead, a "View AI Summary" button appears on any product page with 10+ reviews. Clicking it:

1. Checks the database for a cached summary
2. If none exists, calls Gemini to generate one (spinner shown during generation)
3. Caches the result in the `ReviewSummary` table
4. Displays the summary card

Subsequent clicks toggle the card open/closed instantly using client-side state.

### 2. Summary Content

The AI returns a structured JSON object with:

| Field | Description |
|-------|-------------|
| `sentiment` | Overall sentiment: `"positive"`, `"negative"`, or `"mixed"` |
| `positiveAspects` | 2–5 short phrases describing what readers liked |
| `negativeAspects` | 2–5 short phrases describing what readers disliked |
| `themes` | 2–5 key themes identified across reviews |
| `summaryText` | A neutral 2–3 sentence overview of reader opinion |

### 3. Staleness Detection

When `getReviewSummary()` is called, the cached summary is considered stale if **both** conditions are met:

- The summary was generated more than **24 hours** ago
- The current review count differs from the stored `reviewCount`

Stale summaries are automatically regenerated before being returned.

### 4. Daily Bulk Refresh (Cron)

The `POST /api/review-summaries` endpoint iterates all products with 10+ reviews and regenerates summaries that are stale. Products whose summary was generated within the last 24 hours with no new reviews are skipped.

### 5. AI Disclaimer

Every summary card includes a footer disclaimer:

> This summary was generated by AI and may not perfectly reflect all reader opinions.

The card header is titled "AI-Generated Review Summary" with a sparkle icon.

## Server Actions

### `generateReviewSummary(productId: string)`

1. Validates the product exists and has 10+ reviews
2. Fetches up to 50 most recent reviews (rating + comment)
3. Builds a structured prompt requesting JSON output
4. Calls Gemini with `temperature: 0.3` for consistent results
5. Parses and validates the JSON response (with fallback defaults)
6. Upserts into the `ReviewSummary` table

### `getReviewSummary(productId: string)`

1. Checks for a cached summary in the database
2. If cached and fresh → returns it
3. If cached but stale → regenerates, then returns
4. If no cache and product qualifies (10+ reviews) → generates and returns
5. If product has fewer than 10 reviews → returns `null`

### `refreshAllSummaries()`

1. Finds all products with `numReviews >= 10`
2. For each, checks if the cached summary is still fresh
3. Skips fresh summaries; regenerates stale/missing ones
4. Returns counts: `{ updated, failed, skipped }`

## API Endpoint

### `POST /api/review-summaries`

**Authentication:** Bearer token via `CRON_SECRET` environment variable.

**Request:**
```bash
curl -X POST https://your-app.com/api/review-summaries \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

**Success response (200):**
```json
{
  "message": "Review summaries refreshed",
  "updated": 3,
  "failed": 0,
  "skipped": 12
}
```

**Error responses:**

| Status | Condition |
|--------|-----------|
| 401 | Missing or invalid `Authorization` header |
| 503 | `GOOGLE_GENERATIVE_AI_API_KEY` not configured |
| 500 | Unexpected error during refresh |

## UI Component

The `ReviewSummary` client component receives `productId` and `numReviews` as props.

**Behaviour:**

- Hidden entirely when `numReviews < 10`
- Shows an outline "View AI Summary" button with a sparkle icon
- While generating: button shows spinner + "Generating summary..."
- After loading: button toggles to "Hide AI Summary" / "View AI Summary"
- Errors are shown as red text below the button

**Summary card contents:**

- **Header:** title ("AI-Generated Review Summary"), sentiment badge (color-coded)
- **Metadata:** "Based on N reviews · Last updated DATE"
- **Body:** summary text paragraph
- **Positive aspects:** green-themed list with thumbs-up icon
- **Negative aspects:** red-themed list with thumbs-down icon
- **Key themes:** secondary badges
- **Footer:** bot icon + AI disclaimer text

**Sentiment badge colours:**

| Sentiment | Style |
|-----------|-------|
| Mostly Positive | Green background |
| Mixed | Yellow background |
| Mostly Negative | Red background |

## Prompt Engineering

The prompt instructs the model to:

1. Act as a "literary review analyst"
2. Analyze all provided reviews (up to 50, with star ratings)
3. Return **raw JSON only** (no markdown fences)
4. Follow strict output schema validation
5. Keep aspects as short phrases (3–8 words)
6. Write a neutral, informative summary (2–3 sentences)
7. Allow empty arrays when reviews are uniformly positive or negative
8. Base analysis strictly on the provided review content

Temperature is set to `0.3` for consistent, deterministic output.

## Environment Variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `GOOGLE_GENERATIVE_AI_API_KEY` | Yes | Gemini API access |
| `CRON_SECRET` | Recommended | Protects the bulk-refresh endpoint |

## Scheduling the Daily Refresh

The `/api/review-summaries` endpoint is designed to be called by an external scheduler. Examples:

**Vercel Cron (`vercel.json`):**
```json
{
  "crons": [
    {
      "path": "/api/review-summaries",
      "schedule": "0 3 * * *"
    }
  ]
}
```

**GitHub Actions / external cron service:**
```bash
curl -X POST https://your-app.com/api/review-summaries \
  -H "Authorization: Bearer $CRON_SECRET"
```
