'use server';

import { prisma } from '@/db/prisma';
import { convertToPlainObj, formatError } from '../utils';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

const MIN_REVIEWS_FOR_SUMMARY = 10;

interface ReviewSummaryData {
  sentiment: string;
  positiveAspects: string[];
  negativeAspects: string[];
  themes: string[];
  summaryText: string;
}

function buildSummaryPrompt(
  bookName: string,
  bookAuthor: string,
  reviews: { rating: number; comment: string }[],
): string {
  const reviewTexts = reviews
    .map((r, i) => `Review #${i + 1} (${r.rating}/5 stars): ${r.comment}`)
    .join('\n\n');

  return `You are a literary review analyst. Analyze the following ${reviews.length} reader reviews for the book "${bookName}" by ${bookAuthor}.

Reviews:
${reviewTexts}

Provide a JSON response with exactly this structure (no markdown, no code fences, just raw JSON):
{
  "sentiment": "positive" | "negative" | "mixed",
  "positiveAspects": ["aspect1", "aspect2", "aspect3"],
  "negativeAspects": ["aspect1", "aspect2", "aspect3"],
  "themes": ["theme1", "theme2", "theme3"],
  "summaryText": "A concise 2-3 sentence summary of what readers think about this book."
}

Rules:
- "sentiment" must be exactly one of: "positive", "negative", or "mixed"
- List 2-5 items for positiveAspects, negativeAspects, and themes (fewer if not enough data)
- Each aspect/theme should be a short phrase (3-8 words)
- The summaryText should be neutral, informative, and 2-3 sentences
- If reviews are overwhelmingly positive with no negatives, negativeAspects can be an empty array
- If reviews are overwhelmingly negative with no positives, positiveAspects can be an empty array
- Base analysis strictly on the review content provided`;
}

function parseSummaryResponse(text: string): ReviewSummaryData {
  const cleaned = text
    .replace(/```json\s*/g, '')
    .replace(/```\s*/g, '')
    .trim();

  const parsed = JSON.parse(cleaned);

  const validSentiments = ['positive', 'negative', 'mixed'];
  if (!validSentiments.includes(parsed.sentiment)) {
    parsed.sentiment = 'mixed';
  }

  return {
    sentiment: parsed.sentiment,
    positiveAspects: Array.isArray(parsed.positiveAspects)
      ? parsed.positiveAspects.slice(0, 5)
      : [],
    negativeAspects: Array.isArray(parsed.negativeAspects)
      ? parsed.negativeAspects.slice(0, 5)
      : [],
    themes: Array.isArray(parsed.themes) ? parsed.themes.slice(0, 5) : [],
    summaryText: typeof parsed.summaryText === 'string'
      ? parsed.summaryText
      : 'Unable to generate summary.',
  };
}

export async function generateReviewSummary(productId: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, name: true, author: true, numReviews: true },
    });

    if (!product) {
      return { success: false, message: 'Product not found' };
    }

    if (product.numReviews < MIN_REVIEWS_FOR_SUMMARY) {
      return {
        success: false,
        message: `At least ${MIN_REVIEWS_FOR_SUMMARY} reviews are required to generate a summary`,
      };
    }

    const reviews = await prisma.review.findMany({
      where: { productId },
      select: { rating: true, comment: true },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    const prompt = buildSummaryPrompt(product.name, product.author, reviews);

    const { text } = await generateText({
      model: google('gemini-2.5-flash'),
      prompt,
      maxOutputTokens: 2048,
      temperature: 0.3,
    });

    const summaryData = parseSummaryResponse(text);

    const summary = await prisma.reviewSummary.upsert({
      where: { productId },
      create: {
        productId,
        ...summaryData,
        reviewCount: reviews.length,
        generatedAt: new Date(),
      },
      update: {
        ...summaryData,
        reviewCount: reviews.length,
        generatedAt: new Date(),
      },
    });

    return { success: true, data: convertToPlainObj(summary) };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function getReviewSummary(productId: string) {
  try {
    const summary = await prisma.reviewSummary.findUnique({
      where: { productId },
    });

    const reviewCount = await prisma.review.count({ where: { productId } });
    const qualifies = reviewCount >= MIN_REVIEWS_FOR_SUMMARY;

    if (summary) {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const isStale =
        summary.generatedAt < oneDayAgo &&
        summary.reviewCount !== reviewCount;

      if (isStale && qualifies) {
        const result = await generateReviewSummary(productId);
        if (result.success) return result;
      }

      return { success: true, data: convertToPlainObj(summary) };
    }

    if (!qualifies) {
      return { success: true, data: null };
    }

    return await generateReviewSummary(productId);
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function refreshAllSummaries() {
  try {
    const products = await prisma.product.findMany({
      where: { numReviews: { gte: MIN_REVIEWS_FOR_SUMMARY } },
      select: { id: true },
    });

    const results = { updated: 0, failed: 0, skipped: 0 };

    for (const product of products) {
      const existing = await prisma.reviewSummary.findUnique({
        where: { productId: product.id },
        select: { generatedAt: true, reviewCount: true },
      });

      const currentCount = await prisma.review.count({
        where: { productId: product.id },
      });

      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      if (
        existing &&
        existing.generatedAt > oneDayAgo &&
        existing.reviewCount === currentCount
      ) {
        results.skipped++;
        continue;
      }

      const result = await generateReviewSummary(product.id);
      if (result.success) {
        results.updated++;
      } else {
        results.failed++;
      }
    }

    return { success: true, data: results };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
