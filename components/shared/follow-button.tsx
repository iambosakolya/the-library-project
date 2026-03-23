'use client';

import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { followUser, unfollowUser } from '@/lib/actions/user.actions';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, UserMinus } from 'lucide-react';

const FollowButton = ({
  targetUserId,
  isFollowing,
}: {
  targetUserId: string;
  isFollowing: boolean;
}) => {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleClick = () => {
    startTransition(async () => {
      const res = isFollowing
        ? await unfollowUser(targetUserId)
        : await followUser(targetUserId);

      if (!res.success) {
        toast({ variant: 'destructive', description: res.message });
      } else {
        toast({ description: res.message });
      }
    });
  };

  return (
    <Button
      variant={isFollowing ? 'outline' : 'default'}
      size='sm'
      onClick={handleClick}
      disabled={isPending}
    >
      {isFollowing ? (
        <>
          <UserMinus className='mr-1.5 h-4 w-4' />
          {isPending ? 'Unfollowing...' : 'Unfollow'}
        </>
      ) : (
        <>
          <UserPlus className='mr-1.5 h-4 w-4' />
          {isPending ? 'Following...' : 'Follow'}
        </>
      )}
    </Button>
  );
};

export default FollowButton;
