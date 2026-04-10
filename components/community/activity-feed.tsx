'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Star, ShoppingCart, UserPlus, Activity } from 'lucide-react';

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

const badgeVariantMap: Record<string, 'default' | 'secondary' | 'outline'> = {
  review: 'default',
  registration: 'secondary',
  purchase: 'outline',
};

function timeAgo(dateString: string) {
  const now = Date.now();
  const then = new Date(dateString).getTime();
  const diff = now - then;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export default function ActivityFeed({ data }: { data: ActivityItem[] }) {
  if (!data?.length) {
    return (
      <Card>
        <CardContent className='py-12 text-center text-muted-foreground'>
          No recent activity.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Activity className='h-5 w-5 text-violet-500' />
          Community Activity Feed
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className='h-[360px] pr-3'>
          <div className='space-y-3'>
            {data.map((item, i) => {
              const Icon = iconMap[item.type] ?? Activity;
              const color = colorMap[item.type] ?? 'text-muted-foreground';
              return (
                <div
                  key={`${item.type}-${i}`}
                  className='flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50'
                >
                  <div className={`mt-0.5 ${color}`}>
                    <Icon className='h-4 w-4' />
                  </div>
                  <div className='min-w-0 flex-1'>
                    <p className='truncate text-sm font-medium leading-tight'>
                      {item.title}
                    </p>
                    <p className='mt-0.5 truncate text-xs text-muted-foreground'>
                      {item.description}
                    </p>
                  </div>
                  <div className='flex shrink-0 flex-col items-end gap-1'>
                    <Badge
                      variant={badgeVariantMap[item.type] ?? 'default'}
                      className='px-1.5 py-0 text-[10px]'
                    >
                      {item.type}
                    </Badge>
                    <span className='whitespace-nowrap text-[10px] text-muted-foreground'>
                      {timeAgo(item.createdAt)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
