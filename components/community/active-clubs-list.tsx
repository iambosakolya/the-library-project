'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Library, Users, BookOpen, Globe, MapPin } from 'lucide-react';

interface ClubData {
  id: string;
  title: string;
  purpose: string;
  description: string;
  memberCount: number;
  capacity: number;
  format: string;
  startDate: string;
  bookCount: number;
  creatorName: string;
  activeRegistrations: number;
}

export default function ActiveClubsList({ clubs }: { clubs: ClubData[] }) {
  if (!clubs?.length) {
    return (
      <Card>
        <CardContent className='py-12 text-center text-muted-foreground'>
          No active clubs right now.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Library className='h-5 w-5 text-violet-500' />
          Most Active Reading Clubs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {clubs.map((club) => (
            <div
              key={club.id}
              className='space-y-2 rounded-lg border p-4 transition-shadow hover:shadow-md'
            >
              <div className='flex items-start justify-between'>
                <h3 className='line-clamp-1 text-sm font-semibold'>
                  {club.title}
                </h3>
                <Badge
                  variant={club.format === 'online' ? 'default' : 'secondary'}
                  className='ml-2 shrink-0 text-[10px]'
                >
                  {club.format === 'online' ? (
                    <>
                      <Globe className='mr-0.5 h-2.5 w-2.5' /> Online
                    </>
                  ) : (
                    <>
                      <MapPin className='mr-0.5 h-2.5 w-2.5' /> In-Person
                    </>
                  )}
                </Badge>
              </div>
              <p className='line-clamp-2 text-xs text-muted-foreground'>
                {club.description}
              </p>
              <div className='flex items-center gap-3 text-xs text-muted-foreground'>
                <span className='flex items-center gap-1'>
                  <Users className='h-3 w-3' />
                  {club.memberCount}/{club.capacity}
                </span>
                <span className='flex items-center gap-1'>
                  <BookOpen className='h-3 w-3' />
                  {club.bookCount} books
                </span>
              </div>
              <p className='text-[10px] text-muted-foreground'>
                Created by {club.creatorName}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
