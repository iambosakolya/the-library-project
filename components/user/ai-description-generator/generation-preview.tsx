'use client';

import { Button } from '../../ui/button';
import { RefreshCw, Check } from 'lucide-react';
import { generatorStyles } from './styles';
import { GenerationPreviewProps } from '../shared/types';

export default function GenerationPreview({
  generatedText,
  isGenerating,
  onRegenerate,
  onApply,
}: GenerationPreviewProps) {
  return (
    <div className={generatorStyles.previewWrapper}>
      <div className={generatorStyles.previewBox}>
        {generatedText || (
          <span className={generatorStyles.previewPlaceholder}>
            Generating...
          </span>
        )}
      </div>
      <div className={generatorStyles.previewFooter}>
        <span className={generatorStyles.characterCount}>
          {generatedText.length} characters
        </span>
        <div className={generatorStyles.previewActions}>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            disabled={isGenerating}
            onClick={onRegenerate}
            className={generatorStyles.smallButton}
          >
            <RefreshCw className={generatorStyles.smallIcon} />
            Regenerate
          </Button>
          <Button
            type='button'
            size='sm'
            disabled={isGenerating || !generatedText}
            onClick={onApply}
            className={generatorStyles.smallButton}
          >
            <Check className={generatorStyles.smallIcon} />
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
}
