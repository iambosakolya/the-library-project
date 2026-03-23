import { notFound } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/auth';
import { getUserPublicProfile } from '@/lib/actions/user.actions';
import { formatDateTime } from '@/lib/utils';
import FollowButton from '@/components/shared/follow-button';
import StarRating from '@/components/shared/product/star-rating';
import {
  User,
  BookOpen,
  CalendarDays,
  MessageSquare,
  Users,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const metadata = {
  title: 'User Profile',
};

const ProfilePage = async (props: { params: Promise<{ id: string }> }) => {
  const { id } = await props.params;
  const [session, result] = await Promise.all([
    auth(),
    getUserPublicProfile(id),
  ]);

  if (!result.success || !result.data) notFound();

  const profile = result.data;
  const isOwnProfile = session?.user?.id === profile.id;
  const activeClubs = profile.clubs.filter(
    (c: { isActive: boolean }) => c.isActive,
  );
  const pastClubs = profile.clubs.filter(
    (c: { isActive: boolean }) => !c.isActive,
  );

  return (
    <div className='mx-auto max-w-4xl space-y-8 py-8'>
      {/* Header */}
      <div className='flex items-start justify-between'>
        <div className='flex items-center gap-4'>
          <div className='flex h-16 w-16 items-center justify-center rounded-full bg-muted'>
            <User className='h-8 w-8 text-muted-foreground' />
          </div>
          <div>
            <h1 className='text-2xl font-bold'>{profile.name}</h1>
            <p className='text-sm text-muted-foreground'>
              Member since {formatDateTime(profile.createdAt).dateOnly}
            </p>
            <div className='mt-1 flex items-center gap-4 text-sm text-muted-foreground'>
              <span className='flex items-center gap-1'>
                <Users className='h-3.5 w-3.5' />
                {profile.followerCount} follower
                {profile.followerCount !== 1 ? 's' : ''}
              </span>
              <span>
                {profile.followingCount} following
              </span>
              <span className='flex items-center gap-1'>
                <MessageSquare className='h-3.5 w-3.5' />
                {profile.totalReviews} review
                {profile.totalReviews !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
        {!isOwnProfile && session?.user?.id && (
          <FollowButton
            targetUserId={profile.id}
            isFollowing={profile.isFollowedByCurrentUser}
          />
        )}
      </div>

      {/* Reading Clubs */}
      {profile.clubs.length > 0 && (
        <section className='space-y-3'>
          <h2 className='flex items-center gap-2 text-lg font-semibold'>
            <BookOpen className='h-5 w-5' />
            Reading Clubs
          </h2>
          {activeClubs.length > 0 && (
            <div className='space-y-2'>
              <h3 className='text-sm font-medium text-muted-foreground'>
                Current
              </h3>
              <div className='flex flex-wrap gap-2'>
                {activeClubs.map(
                  (club: { id: string; title: string }) => (
                    <Link key={club.id} href={`/clubs/${club.id}`}>
                      <Badge
                        variant='default'
                        className='cursor-pointer gap-1'
                      >
                        <BookOpen className='h-3 w-3' />
                        {club.title}
                      </Badge>
                    </Link>
                  ),
                )}
              </div>
            </div>
          )}
          {pastClubs.length > 0 && (
            <div className='space-y-2'>
              <h3 className='text-sm font-medium text-muted-foreground'>
                Past
              </h3>
              <div className='flex flex-wrap gap-2'>
                {pastClubs.map(
                  (club: { id: string; title: string }) => (
                    <Link key={club.id} href={`/clubs/${club.id}`}>
                      <Badge
                        variant='secondary'
                        className='cursor-pointer gap-1'
                      >
                        <BookOpen className='h-3 w-3' />
                        {club.title}
                      </Badge>
                    </Link>
                  ),
                )}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Events */}
      {(profile.organizedEvents.length > 0 ||
        profile.registeredEvents.length > 0) && (
        <section className='space-y-3'>
          <h2 className='flex items-center gap-2 text-lg font-semibold'>
            <CalendarDays className='h-5 w-5' />
            Events
          </h2>
          {profile.organizedEvents.length > 0 && (
            <div className='space-y-2'>
              <h3 className='text-sm font-medium text-muted-foreground'>
                Organized
              </h3>
              <div className='flex flex-wrap gap-2'>
                {profile.organizedEvents.map(
                  (event: { id: string; title: string }) => (
                    <Link key={event.id} href={`/events/${event.id}`}>
                      <Badge
                        variant='default'
                        className='cursor-pointer gap-1'
                      >
                        <CalendarDays className='h-3 w-3' />
                        {event.title}
                      </Badge>
                    </Link>
                  ),
                )}
              </div>
            </div>
          )}
          {profile.registeredEvents.length > 0 && (
            <div className='space-y-2'>
              <h3 className='text-sm font-medium text-muted-foreground'>
                Attended / Registered
              </h3>
              <div className='flex flex-wrap gap-2'>
                {profile.registeredEvents.map(
                  (event: {
                    id: string;
                    title: string;
                    eventDate: Date;
                  }) => (
                    <Link key={event.id} href={`/events/${event.id}`}>
                      <Badge
                        variant='secondary'
                        className='cursor-pointer gap-1'
                      >
                        <CalendarDays className='h-3 w-3' />
                        {event.title}
                      </Badge>
                    </Link>
                  ),
                )}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Recent Reviews */}
      <section className='space-y-3'>
        <div className='flex items-center justify-between'>
          <h2 className='flex items-center gap-2 text-lg font-semibold'>
            <MessageSquare className='h-5 w-5' />
            Recent Reviews ({profile.totalReviews})
          </h2>
          {profile.totalReviews > 10 && (
            <Link
              href={`/profile/${profile.id}/reviews`}
              className='text-sm text-primary hover:underline'
            >
              View all
            </Link>
          )}
        </div>
        {profile.recentReviews.length === 0 ? (
          <p className='py-4 text-center text-muted-foreground'>
            No reviews yet.
          </p>
        ) : (
          <div className='space-y-3'>
            {profile.recentReviews.map(
              (review: {
                id: string;
                rating: number;
                comment: string;
                createdAt: Date;
                product: { slug: string; name: string };
              }) => (
                <div
                  key={review.id}
                  className='rounded-lg border p-4'
                >
                  <div className='flex items-start justify-between'>
                    <div>
                      <Link
                        href={`/product/${review.product.slug}`}
                        className='font-medium hover:underline'
                      >
                        {review.product.name}
                      </Link>
                      <div className='mt-1'>
                        <StarRating rating={review.rating} size='sm' />
                      </div>
                    </div>
                    <span className='text-xs text-muted-foreground'>
                      {formatDateTime(review.createdAt).dateOnly}
                    </span>
                  </div>
                  <p className='mt-2 text-sm leading-relaxed text-muted-foreground'>
                    {review.comment.length > 200
                      ? `${review.comment.slice(0, 200)}...`
                      : review.comment}
                  </p>
                </div>
              ),
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default ProfilePage;
