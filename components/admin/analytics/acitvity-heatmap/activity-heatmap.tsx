'use client';

import { cn } from '@/lib/utils';
import { ActivityHeatmapProps } from '../shared/types';
import { DAYS, HOURS, getIntensity } from './utils';
import { activityHeatmapStyles } from './styles';

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
            <div key={h} className={activityHeatmapStyles.hoursSection}>
              {h}
            </div>
          ))}
        </div>

        {/* Heatmap rows */}
        {DAYS.map((day, dayIdx) => (
          <div key={day} className={activityHeatmapStyles.daysSection}>
            <div className={activityHeatmapStyles.daysTitle}>{day}</div>
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
