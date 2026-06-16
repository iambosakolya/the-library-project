'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import { BOOK_LANGUAGES } from '@/lib/constants';
import { generatorStyles } from './styles';
import type {
  OptionsPanelProps,
  DescriptionTone,
  DescriptionLength,
} from '../shared/types';

export default function OptionsPanel({
  tone,
  length,
  targetLanguage,
  onToneChange,
  onLengthChange,
  onLanguageChange,
}: OptionsPanelProps) {
  return (
    <div className={generatorStyles.optionsPanel}>
      <div className={generatorStyles.optionGroup}>
        <label className={generatorStyles.optionLabel}>Tone</label>
        <Select
          value={tone}
          onValueChange={(v) => onToneChange(v as DescriptionTone)}
        >
          <SelectTrigger className={generatorStyles.selectTrigger}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='casual'>Casual</SelectItem>
            <SelectItem value='academic'>Academic</SelectItem>
            <SelectItem value='promotional'>Promotional</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className={generatorStyles.optionGroup}>
        <label className={generatorStyles.optionLabel}>Length</label>
        <Select
          value={length}
          onValueChange={(v) => onLengthChange(v as DescriptionLength)}
        >
          <SelectTrigger className={generatorStyles.selectTrigger}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='short'>Short (2-3 sentences)</SelectItem>
            <SelectItem value='medium'>Medium (1-2 paragraphs)</SelectItem>
            <SelectItem value='long'>Long (2-3 paragraphs)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className={generatorStyles.optionGroup}>
        <label className={generatorStyles.optionLabel}>Language</label>
        <Select value={targetLanguage} onValueChange={onLanguageChange}>
          <SelectTrigger className={generatorStyles.selectTrigger}>
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
  );
}
