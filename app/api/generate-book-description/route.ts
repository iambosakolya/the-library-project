import { NextRequest } from 'next/server';
import { auth } from '@/auth';
import {
  generateBookDescription,
  type GenerateDescriptionParams,
  type DescriptionTone,
  type DescriptionLength,
  type GenerateMode,
} from '@/lib/ai';

const VALID_TONES: DescriptionTone[] = ['academic', 'casual', 'promotional'];
const VALID_LENGTHS: DescriptionLength[] = ['short', 'medium', 'long'];
const VALID_MODES: GenerateMode[] = ['generate', 'improve'];

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  console.log('[generate-book-description] API key present:', !!apiKey, 'length:', apiKey?.length ?? 0);

  if (!apiKey) {
    return Response.json(
      { error: 'AI service is not configured. Set GOOGLE_GENERATIVE_AI_API_KEY in .env and restart the server.' },
      { status: 503 },
    );
  }

  try {
    const body = await req.json();

    const { book, mode = 'generate', tone = 'casual', length = 'medium', targetLanguage } = body as {
      book?: GenerateDescriptionParams['book'];
      mode?: string;
      tone?: string;
      length?: string;
      targetLanguage?: string;
    };

    if (!book?.title || !book?.author) {
      return Response.json(
        { error: 'Title and author are required to generate a description.' },
        { status: 400 },
      );
    }

    if (mode === 'improve' && !book.existingDescription) {
      return Response.json(
        { error: 'Existing description is required for improve mode.' },
        { status: 400 },
      );
    }

    const validatedTone = VALID_TONES.includes(tone as DescriptionTone) ? (tone as DescriptionTone) : 'casual';
    const validatedLength = VALID_LENGTHS.includes(length as DescriptionLength) ? (length as DescriptionLength) : 'medium';
    const validatedMode = VALID_MODES.includes(mode as GenerateMode) ? (mode as GenerateMode) : 'generate';

    const result = generateBookDescription({
      book,
      mode: validatedMode,
      tone: validatedTone,
      length: validatedLength,
      targetLanguage,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('[generate-book-description] Error:', error);
    return Response.json(
      { error: 'Failed to generate description. Please try again.' },
      { status: 500 },
    );
  }
}
