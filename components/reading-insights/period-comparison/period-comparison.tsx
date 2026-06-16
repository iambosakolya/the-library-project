'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeftRight,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from 'lucide-react';
import type { ComparisonData, Period } from '../shared/types';
import { sharedStyles } from '../shared/styles';
import { periodComparisonStyles as styles } from './styles';
import { PERIOD_OPTIONS } from './constants';

function DeltaIndicator({
  current,
  previous,
}: {
  current: number;
  previous: number;
}) {
  if (previous === 0 && current === 0) {
    return <Minus className={styles.deltaNeutralIcon} />;
  }
  const delta =
    previous > 0
      ? ((current - previous) / previous) * 100
      : current > 0
        ? 100
        : 0;
  if (delta > 0) {
    return (
      <span className={styles.deltaPositive}>
        <ArrowUpRight className={styles.deltaIcon} />+{delta.toFixed(0)}%
      </span>
    );
  }
  if (delta < 0) {
    return (
      <span className={styles.deltaNegative}>
        <ArrowDownRight className={styles.deltaIcon} />
        {delta.toFixed(0)}%
      </span>
    );
  }
  return <Minus className={styles.deltaNeutralIcon} />;
}

export default function PeriodComparison() {
  const [periodA, setPeriodA] = useState<Period>('month');
  const [periodB, setPeriodB] = useState<Period>('year');
  const [dataA, setDataA] = useState<ComparisonData | null>(null);
  const [dataB, setDataB] = useState<ComparisonData | null>(null);
  const [isPending, startTransition] = useTransition();

  const fetchPeriod = async (period: Period): Promise<ComparisonData> => {
    const res = await fetch(
      `/api/reading-insights?section=all&period=${period}`,
    );
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
  };

  const handleCompare = () => {
    startTransition(async () => {
      try {
        const [a, b] = await Promise.all([
          fetchPeriod(periodA),
          fetchPeriod(periodB),
        ]);
        setDataA(a);
        setDataB(b);
      } catch {
        // Silently handle errors
      }
    });
  };

  const periodLabel = (p: Period) => {
    const option = PERIOD_OPTIONS.find((o) => o.value === p);
    return option?.label ?? p;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className={sharedStyles.headerTitle}>
          <ArrowLeftRight className={styles.headerIcon} />
          Period Comparison
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Controls */}
        <div className={styles.controls}>
          <Select
            value={periodA}
            onValueChange={(v) => setPeriodA(v as Period)}
          >
            <SelectTrigger className={styles.selectTrigger}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PERIOD_OPTIONS.map((opt) => (
                <SelectItem
                  key={opt.value}
                  value={opt.value}
                  className={styles.selectItem}
                >
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <span className={styles.vsLabel}>vs</span>

          <Select
            value={periodB}
            onValueChange={(v) => setPeriodB(v as Period)}
          >
            <SelectTrigger className={styles.selectTrigger}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PERIOD_OPTIONS.map((opt) => (
                <SelectItem
                  key={opt.value}
                  value={opt.value}
                  className={styles.selectItem}
                >
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <button
            onClick={handleCompare}
            disabled={isPending || periodA === periodB}
            className={styles.compareButton}
          >
            {isPending ? 'Loading…' : 'Compare'}
          </button>
        </div>

        {/* Results */}
        {dataA && dataB && (
          <div className={styles.resultsWrapper}>
            {/* Top Discussed Books Comparison */}
            <div>
              <h4 className={styles.sectionTitle}>Most Discussed Books</h4>
              <div className={styles.comparisonGrid}>
                <div>
                  <p className={styles.periodLabel}>{periodLabel(periodA)}</p>
                  {dataA.mostDiscussed?.slice(0, 5).map((book) => (
                    <div key={book.name} className={styles.itemRow}>
                      <span className={styles.itemName}>{book.name}</span>
                      <span className={styles.itemValue}>
                        {book.reviewCount} reviews
                      </span>
                    </div>
                  ))}
                </div>
                <div>
                  <p className={styles.periodLabel}>{periodLabel(periodB)}</p>
                  {dataB.mostDiscussed?.slice(0, 5).map((book, i) => {
                    const prevBook = dataA.mostDiscussed?.[i];
                    return (
                      <div key={book.name} className={styles.itemRow}>
                        <span className={styles.itemName}>{book.name}</span>
                        <div className={styles.itemValueWithDelta}>
                          <span className={styles.itemValue}>
                            {book.reviewCount} reviews
                          </span>
                          {prevBook && (
                            <DeltaIndicator
                              current={book.reviewCount}
                              previous={prevBook.reviewCount}
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Top Authors Comparison */}
            <div>
              <h4 className={styles.sectionTitle}>Top Authors</h4>
              <div className={styles.comparisonGrid}>
                <div>
                  <p className={styles.periodLabel}>{periodLabel(periodA)}</p>
                  {dataA.authorSpotlight?.slice(0, 5).map((a) => (
                    <div key={a.author} className={styles.itemRow}>
                      <span className={styles.itemName}>{a.author}</span>
                      <span className={styles.itemValue}>
                        {a.totalReviews} reviews
                      </span>
                    </div>
                  ))}
                </div>
                <div>
                  <p className={styles.periodLabel}>{periodLabel(periodB)}</p>
                  {dataB.authorSpotlight?.slice(0, 5).map((a, i) => {
                    const prevA = dataA.authorSpotlight?.[i];
                    return (
                      <div key={a.author} className={styles.itemRow}>
                        <span className={styles.itemName}>{a.author}</span>
                        <div className={styles.itemValueWithDelta}>
                          <span className={styles.itemValue}>
                            {a.totalReviews} reviews
                          </span>
                          {prevA && (
                            <DeltaIndicator
                              current={a.totalReviews}
                              previous={prevA.totalReviews}
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {!dataA && !dataB && (
          <p className={styles.emptyHint}>
            Select two different periods and click Compare to see side-by-side
            analytics.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
