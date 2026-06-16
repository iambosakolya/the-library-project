'use client';

import { useEffect, useRef, useState } from 'react';
import { Star } from 'lucide-react';
import { ActivityItem } from '../shared/types';
import { colorMap, iconMap } from '../shared/styles';
import { activityTickerStyles as styles } from './styles';

export default function ActivityTicker({ data }: { data: ActivityItem[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !data?.length) return;

    let animId: number;
    let pos = 0;

    const step = () => {
      if (!paused) {
        pos += 0.5;
        if (pos >= el.scrollWidth / 2) pos = 0;
        el.scrollLeft = pos;
      }
      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [paused, data]);

  if (!data?.length) return null;

  // Duplicate items for infinite scroll illusion
  const items = [...data, ...data];

  return (
    <div
      className={styles.wrapper}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div ref={scrollRef} className={styles.scrollContainer}>
        {items.map((item, i) => {
          const Icon = iconMap[item.type] ?? Star;
          const color = colorMap[item.type] ?? 'text-muted-foreground';
          return (
            <div key={`tick-${i}`} className={styles.tickerItem}>
              <Icon className={`${styles.icon} ${color}`} />
              <span className={styles.title}>{item.title}</span>
              <span className={styles.description}>{item.description}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
