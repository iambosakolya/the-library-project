'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Loader2, UserPlus, UserMinus } from 'lucide-react';

type RegisterButtonProps = {
  clubId?: string;
  eventId?: string;
  type: 'club' | 'event';
  isRegistered: boolean;
  registrationId?: string;
  availableSeats: number;
  isAuthenticated: boolean;
  isPast?: boolean;
};

export default function RegisterButton({
  clubId,
  eventId,
  type,
  isRegistered,
  registrationId,
  availableSeats,
  isAuthenticated,
  isPast = false,
}: RegisterButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState<'register' | 'cancel'>(
    'register',
  );
  const { toast } = useToast();
  const router = useRouter();

  const handleRegister = async () => {
    if (!isAuthenticated) {
      router.push('/sign-in');
      return;
    }

    if (availableSeats <= 0) {
      toast({
        title: 'Full',
        description: `This ${type} is already full`,
        variant: 'destructive',
      });
      return;
    }

    setDialogAction('register');
    setShowDialog(true);
  };

  const handleCancel = () => {
    setDialogAction('cancel');
    setShowDialog(true);
  };

  const confirmAction = async () => {
    setIsLoading(true);
    setShowDialog(false);

    try {
      if (dialogAction === 'register') {
        const response = await fetch('/api/registrations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ clubId, eventId }),
        });

        const result = await response.json();

        if (result.success) {
          toast({
            title: 'Success!',
            description: result.message,
          });
          router.refresh();
        } else {
          toast({
            title: 'Error',
            description: result.message,
            variant: 'destructive',
          });
        }
      } else {
        const response = await fetch(`/api/registrations/${registrationId}`, {
          method: 'DELETE',
        });

        const result = await response.json();

        if (result.success) {
          toast({
            title: 'Cancelled',
            description: result.message,
          });
          router.refresh();
        } else {
          toast({
            title: 'Error',
            description: result.message,
            variant: 'destructive',
          });
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isPast) {
    return (
      <Button disabled variant='secondary'>
        Past {type === 'club' ? 'Club' : 'Event'}
      </Button>
    );
  }

  if (!isAuthenticated) {
    return (
      <Button onClick={handleRegister}>
        <UserPlus className='mr-2 h-4 w-4' />
        Sign in to Register
      </Button>
    );
  }

  if (isRegistered) {
    return (
      <>
        <Button
          variant='destructive'
          onClick={handleCancel}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
          ) : (
            <UserMinus className='mr-2 h-4 w-4' />
          )}
          Cancel Registration
        </Button>

        <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel Registration</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to cancel your registration for this{' '}
                {type}? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>No, keep it</AlertDialogCancel>
              <AlertDialogAction onClick={confirmAction}>
                Yes, cancel registration
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }

  return (
    <>
      <Button
        onClick={handleRegister}
        disabled={isLoading || availableSeats <= 0}
      >
        {isLoading ? (
          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
        ) : (
          <UserPlus className='mr-2 h-4 w-4' />
        )}
        {availableSeats <= 0 ? 'Full' : 'Register'}
      </Button>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Registration</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to register for this {type}?
              {availableSeats <= 5 && availableSeats > 0 && (
                <span className='mt-2 block font-semibold text-orange-600'>
                  Only {availableSeats} seat{availableSeats !== 1 ? 's' : ''}{' '}
                  remaining!
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmAction}>
              Confirm Registration
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
