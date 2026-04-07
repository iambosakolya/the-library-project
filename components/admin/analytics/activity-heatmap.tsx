'use client';

import { cn } from '@/lib/utils';

interface HeatmapCell {
  dayOfWeek: number;
  hour: number;
  count: number;
}

interface ActivityHeatmapProps {
  data: HeatmapCell[];
  height?: number;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const HOURS = Array.from({ length: 24 }, (_, i) =>
  i === 0 ? '12am' : i < 12 ? `${i}am` : i === 12 ? '12pm' : `${i - 12}pm`,
);

function getIntensity(count: number, max: number): string {
  if (count === 0) return 'bg-muted';
  const ratio = count / max;
  if (ratio < 0.2) return 'bg-indigo-100 dark:bg-indigo-950';
  if (ratio < 0.4) return 'bg-indigo-200 dark:bg-indigo-900';
  if (ratio < 0.6) return 'bg-indigo-300 dark:bg-indigo-800';
  if (ratio < 0.8) return 'bg-indigo-400 dark:bg-indigo-700';
  return 'bg-indigo-500 dark:bg-indigo-600';
}

export function ActivityHeatmap({ data }: ActivityHeatmapProps) {
  const max = Math.max(...data.map((d) => d.count), 1);
  const lookup = new Map(
    data.map((d) => [`${d.dayOfWeek}-${d.hour}`, d.count]),
  );

  return (
    <div className='overflow-x-auto'>
      <div className='min-w-[700px]'>
        {/* Hour headers */}
        <div className='flex'>
          <div className='w-12' />
          {HOURS.filter((_, i) => i % 3 === 0).map((h) => (
            <div
              key={h}
              className='flex-1 text-center text-xs text-muted-foreground'
            >
              {h}
            </div>
          ))}
        </div>

        {/* Heatmap rows */}
        {DAYS.map((day, dayIdx) => (
          <div key={day} className='mb-0.5 flex items-center gap-0.5'>
            <div className='w-12 pr-2 text-right text-xs text-muted-foreground'>
              {day}
            </div>
            {Array.from({ length: 24 }, (_, hour) => {
              const count = lookup.get(`${dayIdx}-${hour}`) ?? 0;
              return (
                <div
                  key={hour}
                  className={cn(
                    'h-6 flex-1 cursor-default rounded-sm transition-colors',
                    getIntensity(count, max),
                  )}
                  title={`${day} ${HOURS[hour]}: ${count} orders`}
                />
              );
            })}
          </div>
        ))}

        {/* Legend */}
        <div className='mt-2 flex items-center justify-end gap-1'>
          <span className='mr-1 text-xs text-muted-foreground'>Less</span>
          {[
            'bg-muted',
            'bg-indigo-100 dark:bg-indigo-950',
            'bg-indigo-200 dark:bg-indigo-900',
            'bg-indigo-300 dark:bg-indigo-800',
            'bg-indigo-400 dark:bg-indigo-700',
            'bg-indigo-500 dark:bg-indigo-600',
          ].map((cls, i) => (
            <div key={i} className={cn('h-4 w-4 rounded-sm', cls)} />
          ))}
          <span className='ml-1 text-xs text-muted-foreground'>More</span>
        </div>
      </div>
    </div>
  );
}
