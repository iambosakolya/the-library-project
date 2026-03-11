import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { BOOK_LANGUAGES } from './constants';

export type DescriptionTone = 'academic' | 'casual' | 'promotional';
export type DescriptionLength = 'short' | 'medium' | 'long';
export type GenerateMode = 'generate' | 'improve';

export interface BookContext {
  title: string;
  author: string;
  categories: string[];
  language?: string;
  publishedDate?: string;
  pageCount?: number | null;
  publisher?: string;
  existingDescription?: string;
}

export interface GenerateDescriptionParams {
  book: BookContext;
  mode: GenerateMode;
  tone: DescriptionTone;
  length: DescriptionLength;
  targetLanguage?: string;
}

const LENGTH_GUIDE: Record<DescriptionLength, string> = {
  short: '2-3 sentences (around 50-80 words)',
  medium: '1-2 paragraphs (around 120-200 words)',
  long: '2-3 paragraphs (around 250-400 words)',
};

const TONE_GUIDE: Record<DescriptionTone, string> = {
  academic:
    'Use a formal, scholarly tone. Focus on the work\'s thematic depth, literary merit, and contribution to its field or genre. Avoid sensationalism.',
  casual:
    'Use a warm, conversational tone as if recommending the book to a friend. Be engaging and approachable while still informative.',
  promotional:
    'Use compelling, marketing-oriented language. Highlight what makes this book a must-read. Create urgency and excitement without being misleading.',
};

function getLanguageName(code?: string): string {
  if (!code) return 'English';
  const found = BOOK_LANGUAGES.find((l) => l.code === code);
  return found?.name || 'English';
}

function buildPrompt(params: GenerateDescriptionParams): string {
  const { book, mode, tone, length, targetLanguage } = params;
  const lang = getLanguageName(targetLanguage || book.language);

  const metadata = [
    `Title: "${book.title}"`,
    `Author: ${book.author}`,
    book.categories.length > 0 ? `Genre/Categories: ${book.categories.join(', ')}` : null,
    book.publishedDate ? `Published: ${book.publishedDate}` : null,
    book.pageCount ? `Pages: ${book.pageCount}` : null,
    book.publisher ? `Publisher: ${book.publisher}` : null,
  ]
    .filter(Boolean)
    .join('\n');

  if (mode === 'improve' && book.existingDescription) {
    return `You are an expert book editor and copywriter. Improve the following book description.

Book metadata:
${metadata}

Current description:
"""
${book.existingDescription}
"""

Requirements:
- ${TONE_GUIDE[tone]}
- Target length: ${LENGTH_GUIDE[length]}
- Write in ${lang}.
- Keep factual information accurate.
- Improve clarity, flow, and engagement.
- Do NOT include the book title or "by [author]" at the start — the description will appear alongside that info.
- The description MUST be complete. Never stop mid-sentence. Always finish with a complete thought.
- Return ONLY the improved description text, no headings or labels.`;
  }

  return `You are an expert book copywriter. Write a compelling book description.

Book metadata:
${metadata}

Requirements:
- ${TONE_GUIDE[tone]}
- Target length: ${LENGTH_GUIDE[length]}
- Write in ${lang}.
- Make it engaging and accurate for the genre.
- Do NOT include the book title or "by [author]" at the start — the description will appear alongside that info.
- Do NOT start with generic phrases like "This book..." or "In this book...". Start with something that hooks the reader.
- The description MUST be complete. Never stop mid-sentence. Always finish with a complete thought.
- Return ONLY the description text, no headings or labels.`;
}

export function generateBookDescription(params: GenerateDescriptionParams) {
  const prompt = buildPrompt(params);

  return streamText({
    model: google('gemini-2.5-flash'),
    prompt,
    maxOutputTokens: 4096,
    temperature: 0.7,
  });
}
