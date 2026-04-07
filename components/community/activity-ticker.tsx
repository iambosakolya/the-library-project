'use client';

import { useEffect, useRef, useState } from 'react';
import { Star, ShoppingCart, UserPlus } from 'lucide-react';

interface ActivityItem {
  type: 'review' | 'registration' | 'purchase';
  title: string;
  description: string;
  createdAt: string;
}

const iconMap = {
  review: Star,
  registration: UserPlus,
  purchase: ShoppingCart,
};

const colorMap = {
  review: 'text-yellow-500',
  registration: 'text-blue-500',
  purchase: 'text-emerald-500',
};

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
      className='w-full overflow-hidden border-y bg-muted/50 py-2'
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        ref={scrollRef}
        className='flex gap-6 overflow-hidden whitespace-nowrap px-4'
      >
        {items.map((item, i) => {
          const Icon = iconMap[item.type] ?? Star;
          const color = colorMap[item.type] ?? 'text-muted-foreground';
          return (
            <div
              key={`tick-${i}`}
              className='inline-flex shrink-0 items-center gap-2'
            >
              <Icon className={`h-3.5 w-3.5 ${color}`} />
              <span className='text-xs font-medium'>{item.title}</span>
              <span className='text-[10px] text-muted-foreground'>
                {item.description}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
