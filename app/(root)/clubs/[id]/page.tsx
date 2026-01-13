import { getReadingClubById } from '@/lib/actions/club-request.actions';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  VideoIcon,
  BookOpenIcon,
  ClockIcon,
} from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import Image from 'next/image';

type ClubDetailPageProps = {
  params: {
    id: string;
  };
};

const ClubDetailPage = async ({ params }: ClubDetailPageProps) => {
  const result = await getReadingClubById(params.id);

  if (!result.success || !result.data) {
    notFound();
  }

  const club = result.data;

  return (
    <div className='container mx-auto max-w-4xl px-4 py-8'>
      {/* Header */}
      <div className='mb-8'>
        <div className='mb-4 flex items-start justify-between'>
          <div className='flex-1'>
            <h1 className='mb-2 text-4xl font-bold'>{club.title}</h1>
            <p className='text-lg text-muted-foreground'>{club.purpose}</p>
          </div>
          <Badge
            variant={club.format === 'online' ? 'default' : 'secondary'}
            className='text-sm'
          >
            {club.format === 'online' ? (
              <VideoIcon className='mr-1 h-4 w-4' />
            ) : (
              <MapPinIcon className='mr-1 h-4 w-4' />
            )}
            {club.format}
          </Badge>
        </div>

        {/* Quick Info */}
        <div className='flex flex-wrap gap-4 text-sm'>
          <div className='flex items-center'>
            <CalendarIcon className='mr-2 h-4 w-4 text-muted-foreground' />
            <span>
              {format(new Date(club.startDate), 'PPP')}
              {club.endDate && <> - {format(new Date(club.endDate), 'PPP')}</>}
            </span>
          </div>
          <div className='flex items-center'>
            <UsersIcon className='mr-2 h-4 w-4 text-muted-foreground' />
            <span>
              {club.memberIds.length} / {club.capacity} members
            </span>
          </div>
          <div className='flex items-center'>
            <ClockIcon className='mr-2 h-4 w-4 text-muted-foreground' />
            <span>{club.sessionCount} sessions</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='mb-8 grid gap-6'>
        {/* Description Card */}
        <Card>
          <CardHeader>
            <CardTitle>About This Club</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='whitespace-pre-wrap'>{club.description}</p>
          </CardContent>
        </Card>

        {/* Location/Link Card */}
        <Card>
          <CardHeader>
            <CardTitle>
              {club.format === 'online' ? 'Meeting Link' : 'Location'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {club.format === 'online' && club.onlineLink ? (
              <div className='flex items-center gap-2'>
                <VideoIcon className='h-5 w-5 text-muted-foreground' />
                <a
                  href={club.onlineLink}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-primary hover:underline'
                >
                  {club.onlineLink}
                </a>
              </div>
            ) : club.format === 'offline' && club.address ? (
              <div className='flex items-center gap-2'>
                <MapPinIcon className='h-5 w-5 text-muted-foreground' />
                <span>{club.address}</span>
              </div>
            ) : (
              <p className='text-muted-foreground'>
                Location details will be shared with members
              </p>
            )}
          </CardContent>
        </Card>

        {/* Organizer Card */}
        {club.creator && (
          <Card>
            <CardHeader>
              <CardTitle>Organizer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex items-center gap-3'>
                {club.creator.image && (
                  <Image
                    src={club.creator.image}
                    alt={club.creator.name}
                    width={48}
                    height={48}
                    className='h-12 w-12 rounded-full'
                  />
                )}
                <div>
                  <p className='font-medium'>{club.creator.name}</p>
                  <p className='text-sm text-muted-foreground'>
                    {club.creator.email}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Books Card */}
        {club.bookIds.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <BookOpenIcon className='h-5 w-5' />
                Reading List
              </CardTitle>
              <CardDescription>
                {club.bookIds.length} book{club.bookIds.length !== 1 ? 's' : ''}{' '}
                selected for this club
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-muted-foreground'>
                Book details will be visible to club members
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Action Buttons */}
      <div className='flex gap-4'>
        <Button
          size='lg'
          className='flex-1'
          disabled={club.memberIds.length >= club.capacity}
        >
          {club.memberIds.length >= club.capacity ? 'Club Full' : 'Join Club'}
        </Button>
        <Link href='/clubs'>
          <Button size='lg' variant='outline'>
            Back to Clubs
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ClubDetailPage;
