import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { risingBooksStyles as styles } from './styles';

export function GrowthBadge({ percent }: { percent: number }) {
  if (percent > 0) {
    return (
      <span className={styles.growthPositive}>
        <ArrowUpRight className={styles.growthIcon} />+{percent}%
      </span>
    );
  }
  if (percent < 0) {
    return (
      <span className={styles.growthNegative}>
        <ArrowDownRight className={styles.growthIcon} />
        {percent}%
      </span>
    );
  }
  return (
    <span className={styles.growthNeutral}>
      <Minus className={styles.growthIcon} />
      0%
    </span>
  );
}
