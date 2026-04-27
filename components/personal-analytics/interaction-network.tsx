'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Network, UserCircle } from 'lucide-react';
import Image from 'next/image';
import type { InteractionUser } from '@/lib/actions/personal-analytics.actions';

const TYPE_LABELS: Record<string, string> = {
  review_reply: 'Review interactions',
  club_member: 'Club co-member',
  follower: 'Follower/Following',
};

const TYPE_COLORS: Record<string, string> = {
  review_reply:
    'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
  club_member:
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  follower: 'bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300',
};

export default function InteractionNetwork({
  data,
}: {
  data: InteractionUser[];
}) {
  if (!data.length) {
    return (
      <Card>
        <CardContent className='py-12 text-center text-muted-foreground'>
          No interactions yet. Engage with the community to build your network!
        </CardContent>
      </Card>
    );
  }

  const maxInteractions = Math.max(...data.map((d) => d.interactions));

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Network className='h-5 w-5 text-cyan-500' />
          Interaction Network
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-2'>
          {data.slice(0, 10).map((user) => (
            <div
              key={user.id}
              className='flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50'
            >
              <div className='flex h-8 w-8 items-center justify-center rounded-full bg-muted'>
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name}
                    width={32}
                    height={32}
                    className='h-8 w-8 rounded-full object-cover'
                  />
                ) : (
                  <UserCircle className='h-5 w-5 text-muted-foreground' />
                )}
              </div>
              <div className='flex-1'>
                <div className='flex items-center justify-between'>
                  <p className='text-sm font-medium'>{user.name}</p>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${TYPE_COLORS[user.type] || ''}`}
                  >
                    {TYPE_LABELS[user.type] || user.type}
                  </span>
                </div>
                <div className='mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted'>
                  <div
                    className='h-full rounded-full bg-cyan-500 transition-all'
                    style={{
                      width: `${(user.interactions / maxInteractions) * 100}%`,
                    }}
                  />
                </div>
              </div>
              <span className='text-xs font-semibold text-muted-foreground'>
                {user.interactions}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
