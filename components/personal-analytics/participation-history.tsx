'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar } from 'lucide-react';
import type { ParticipationItem } from '@/lib/actions/personal-analytics.actions';

export default function ParticipationHistory({
  data,
}: {
  data: ParticipationItem[];
}) {
  if (!data.length) {
    return (
      <Card>
        <CardContent className='py-12 text-center text-muted-foreground'>
          No participation history yet. Join a club or register for an event!
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Calendar className='h-5 w-5 text-amber-500' />
          Club & Event Participation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-3'>
          {data.map((item) => (
            <div
              key={item.id}
              className='flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50'
            >
              <div className='flex items-center gap-3'>
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    item.type === 'club'
                      ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400'
                      : 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400'
                  }`}
                >
                  {item.type === 'club' ? (
                    <Users className='h-5 w-5' />
                  ) : (
                    <Calendar className='h-5 w-5' />
                  )}
                </div>
                <div>
                  <p className='font-medium'>{item.title}</p>
                  <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                    <Badge variant='outline' className='text-xs'>
                      {item.type}
                    </Badge>
                    <Badge
                      variant={
                        item.role === 'organizer' ? 'default' : 'secondary'
                      }
                      className='text-xs'
                    >
                      {item.role}
                    </Badge>
                    <span>
                      {new Date(item.startDate).toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </div>
              <div className='text-right'>
                <div className='flex items-center gap-1'>
                  <Badge
                    variant={item.isActive ? 'default' : 'secondary'}
                    className='text-xs'
                  >
                    {item.isActive ? 'Active' : 'Ended'}
                  </Badge>
                </div>
                {item.attendanceRate > 0 && (
                  <p className='mt-1 text-xs text-muted-foreground'>
                    {item.attendanceRate}% attendance
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
