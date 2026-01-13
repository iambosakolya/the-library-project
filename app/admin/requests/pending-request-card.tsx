'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ClubEventRequest } from '@/types';
import {
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  VideoIcon,
  EyeIcon,
} from 'lucide-react';
import { format } from 'date-fns';

type PendingRequestCardProps = {
  request: ClubEventRequest;
  onViewDetails: () => void;
};

const PendingRequestCard = ({
  request,
  onViewDetails,
}: PendingRequestCardProps) => {
  return (
    <Card>
      <CardHeader>
        <div className='flex items-start justify-between'>
          <div className='flex-1 space-y-1'>
            <CardTitle className='flex flex-wrap items-center gap-2'>
              {request.title}
              <Badge variant='secondary' className='capitalize'>
                {request.type}
              </Badge>
              {request.format === 'online' ? (
                <Badge variant='outline' className='gap-1'>
                  <VideoIcon className='h-3 w-3' />
                  Online
                </Badge>
              ) : (
                <Badge variant='outline' className='gap-1'>
                  <MapPinIcon className='h-3 w-3' />
                  In-Person
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Submitted by{' '}
              <span className='font-medium'>{request.user?.name}</span> (
              {request.user?.email}) •{' '}
              {format(new Date(request.createdAt), 'PPP')}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className='space-y-4'>
        <div>
          <h3 className='mb-1 text-sm font-semibold'>Purpose</h3>
          <p className='line-clamp-2 text-sm text-muted-foreground'>
            {request.purpose}
          </p>
        </div>

        <div className='flex flex-wrap gap-4 text-sm'>
          <div className='flex items-center gap-1'>
            <CalendarIcon className='h-4 w-4 text-muted-foreground' />
            <span>{format(new Date(request.startDate), 'PP')}</span>
          </div>
          <div className='flex items-center gap-1'>
            <UsersIcon className='h-4 w-4 text-muted-foreground' />
            <span>{request.capacity} capacity</span>
          </div>
          {request.type === 'club' && (
            <div className='flex items-center gap-1'>
              <span className='text-muted-foreground'>
                {request.sessionCount} sessions
              </span>
            </div>
          )}
        </div>

        <Button onClick={onViewDetails} className='w-full' variant='outline'>
          <EyeIcon className='mr-2 h-4 w-4' />
          View Details & Moderate
        </Button>
      </CardContent>
    </Card>
  );
};

export default PendingRequestCard;
