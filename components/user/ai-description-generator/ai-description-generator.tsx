'use client';

import { useState, useCallback } from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Sparkles, Loader2, Wand2 } from 'lucide-react';
import type {
  DescriptionTone,
  DescriptionLength,
  GenerateMode,
} from '@/lib/ai';
import { generatorStyles } from './styles';
import { AIDescriptionGeneratorProps } from '../shared/types';
import OptionsPanel from './options-panel';
import GenerationPreview from './generation-preview';

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
              existingDescription:
                mode === 'improve' ? currentDescription : undefined,
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
    <Card className={generatorStyles.card}>
      <CardContent className={generatorStyles.cardContent}>
        {/* Header row */}
        <div className={generatorStyles.headerRow}>
          <Badge variant='secondary' className={generatorStyles.badge}>
            <Sparkles className={generatorStyles.badgeIcon} />
            AI Assistant
          </Badge>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            className={generatorStyles.optionsButton}
            onClick={() => setShowOptions(!showOptions)}
          >
            {showOptions ? 'Hide options' : 'Options'}
          </Button>
        </div>

        {/* Options panel */}
        {showOptions && (
          <OptionsPanel
            tone={tone}
            length={length}
            targetLanguage={targetLanguage}
            onToneChange={setTone}
            onLengthChange={setLength}
            onLanguageChange={setTargetLanguage}
          />
        )}

        {/* Action buttons */}
        <div className={generatorStyles.actionsRow}>
          <Button
            type='button'
            variant='outline'
            size='sm'
            disabled={isGenerating || !canGenerate}
            onClick={() => handleGenerate('generate')}
            className={generatorStyles.actionButton}
          >
            {isGenerating ? (
              <Loader2 className={generatorStyles.actionIconSpin} />
            ) : (
              <Sparkles className={generatorStyles.actionIcon} />
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
              className={generatorStyles.actionButton}
            >
              {isGenerating ? (
                <Loader2 className={generatorStyles.actionIconSpin} />
              ) : (
                <Wand2 className={generatorStyles.actionIcon} />
              )}
              Improve Current
            </Button>
          )}
        </div>

        {!canGenerate && (
          <p className={generatorStyles.hintText}>
            Fill in the title and author first to use AI generation.
          </p>
        )}

        {/* Error */}
        {error && <p className={generatorStyles.errorText}>{error}</p>}

        {/* Preview area */}
        {(generatedText || isGenerating) && (
          <GenerationPreview
            generatedText={generatedText}
            isGenerating={isGenerating}
            onRegenerate={() => handleGenerate('generate')}
            onApply={handleApply}
          />
        )}
      </CardContent>
    </Card>
  );
}
