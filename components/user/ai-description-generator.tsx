'use client';

import { useState, useCallback } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Sparkles, Loader2, RefreshCw, Check, Wand2 } from 'lucide-react';
import { BOOK_LANGUAGES } from '@/lib/constants';
import type { DescriptionTone, DescriptionLength, GenerateMode } from '@/lib/ai';

interface BookContext {
  title: string;
  author: string;
  categories: string[];
  language?: string;
  publishedDate?: string;
  pageCount?: number | null;
  publisher?: string;
}

interface AIDescriptionGeneratorProps {
  book: BookContext;
  currentDescription: string;
  onApply: (text: string) => void;
}

export default function AIDescriptionGenerator({
  book,
  currentDescription,
  onApply,
}: AIDescriptionGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedText, setGeneratedText] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [tone, setTone] = useState<DescriptionTone>('casual');
  const [length, setLength] = useState<DescriptionLength>('medium');
  const [targetLanguage, setTargetLanguage] = useState<string>('');
  const [error, setError] = useState('');

  const canGenerate = book.title && book.author;

  const handleGenerate = useCallback(
    async (mode: GenerateMode) => {
      if (!canGenerate) return;

      setIsGenerating(true);
      setError('');
      setGeneratedText('');

      try {
        const response = await fetch('/api/generate-book-description', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            book: {
              ...book,
              existingDescription: mode === 'improve' ? currentDescription : undefined,
            },
            mode,
            tone,
            length,
            targetLanguage: targetLanguage || undefined,
          }),
        });

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data.error || 'Failed to generate description');
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error('No response stream');

        const decoder = new TextDecoder();
        let accumulated = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          accumulated += decoder.decode(value, { stream: true });
          setGeneratedText(accumulated);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setIsGenerating(false);
      }
    },
    [book, currentDescription, tone, length, targetLanguage, canGenerate],
  );

  const handleApply = () => {
    onApply(generatedText);
    setGeneratedText('');
  };

  return (
    <Card className='border-dashed border-violet-300 dark:border-violet-700'>
      <CardContent className='space-y-3 pt-4'>
        {/* Header row */}
        <div className='flex flex-wrap items-center gap-2'>
          <Badge variant='secondary' className='gap-1 bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300'>
            <Sparkles className='h-3 w-3' />
            AI Assistant
          </Badge>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            className='ml-auto text-xs'
            onClick={() => setShowOptions(!showOptions)}
          >
            {showOptions ? 'Hide options' : 'Options'}
          </Button>
        </div>

        {/* Options panel */}
        {showOptions && (
          <div className='grid grid-cols-1 gap-3 rounded-lg border bg-muted/40 p-3 sm:grid-cols-3'>
            <div className='space-y-1'>
              <label className='text-xs font-medium'>Tone</label>
              <Select value={tone} onValueChange={(v) => setTone(v as DescriptionTone)}>
                <SelectTrigger className='h-8 text-xs'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='casual'>Casual</SelectItem>
                  <SelectItem value='academic'>Academic</SelectItem>
                  <SelectItem value='promotional'>Promotional</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='space-y-1'>
              <label className='text-xs font-medium'>Length</label>
              <Select value={length} onValueChange={(v) => setLength(v as DescriptionLength)}>
                <SelectTrigger className='h-8 text-xs'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='short'>Short (2-3 sentences)</SelectItem>
                  <SelectItem value='medium'>Medium (1-2 paragraphs)</SelectItem>
                  <SelectItem value='long'>Long (2-3 paragraphs)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='space-y-1'>
              <label className='text-xs font-medium'>
                Language
              </label>
              <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                <SelectTrigger className='h-8 text-xs'>
                  <SelectValue placeholder='Auto (from book)' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='auto'>Auto (from book)</SelectItem>
                  {BOOK_LANGUAGES.filter((l) => l.code !== 'other').map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className='flex flex-wrap gap-2'>
          <Button
            type='button'
            variant='outline'
            size='sm'
            disabled={isGenerating || !canGenerate}
            onClick={() => handleGenerate('generate')}
            className='gap-1'
          >
            {isGenerating ? (
              <Loader2 className='h-3.5 w-3.5 animate-spin' />
            ) : (
              <Sparkles className='h-3.5 w-3.5' />
            )}
            Generate Description
          </Button>

          {currentDescription.length >= 10 && (
            <Button
              type='button'
              variant='outline'
              size='sm'
              disabled={isGenerating || !canGenerate}
              onClick={() => handleGenerate('improve')}
              className='gap-1'
            >
              {isGenerating ? (
                <Loader2 className='h-3.5 w-3.5 animate-spin' />
              ) : (
                <Wand2 className='h-3.5 w-3.5' />
              )}
              Improve Current
            </Button>
          )}
        </div>

        {!canGenerate && (
          <p className='text-xs text-muted-foreground'>
            Fill in the title and author first to use AI generation.
          </p>
        )}

        {/* Error */}
        {error && (
          <p className='text-sm text-destructive'>{error}</p>
        )}

        {/* Preview area */}
        {(generatedText || isGenerating) && (
          <div className='space-y-2'>
            <div className='max-h-60 overflow-y-auto rounded-md border bg-background p-3 text-sm'>
              {generatedText || (
                <span className='animate-pulse text-muted-foreground'>Generating...</span>
              )}
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-xs text-muted-foreground'>
                {generatedText.length} characters
              </span>
              <div className='flex gap-2'>
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  disabled={isGenerating}
                  onClick={() => handleGenerate('generate')}
                  className='gap-1 text-xs'
                >
                  <RefreshCw className='h-3 w-3' />
                  Regenerate
                </Button>
                <Button
                  type='button'
                  size='sm'
                  disabled={isGenerating || !generatedText}
                  onClick={handleApply}
                  className='gap-1 text-xs'
                >
                  <Check className='h-3 w-3' />
                  Apply
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
