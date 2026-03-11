'use client';

import { useState, useTransition } from 'react';
import { Registration, Attendance } from '@/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import {
  markAttendance,
  sendMessageToParticipants,
} from '@/lib/actions/organizer.actions';
import Image from 'next/image';
import { format } from 'date-fns';
import {
  UserIcon,
  MailIcon,
  CheckCircleIcon,
  XCircleIcon,
  MinusCircleIcon,
  SendIcon,
  CalendarCheckIcon,
} from 'lucide-react';

type Props = {
  participants: Registration[];
  attendanceRecords: Attendance[];
  entityId: string;
  entityType: 'club' | 'event';
  entityTitle: string;
  totalSessions: number;
};

export default function ParticipantListView({
  participants,
  attendanceRecords,
  entityId,
  entityType,
  entityTitle,
  totalSessions,
}: Props) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [selectedSession, setSelectedSession] = useState(1);
  const [messageOpen, setMessageOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [localAttendance, setLocalAttendance] =
    useState<Attendance[]>(attendanceRecords);

  const activeParticipants = participants.filter(
    (p) => p.status === 'active',
  );
  const cancelledParticipants = participants.filter(
    (p) => p.status === 'cancelled',
  );

  const getAttendanceForUser = (
    userId: string,
    sessionNumber: number,
  ): Attendance | undefined => {
    return localAttendance.find(
      (a) => a.userId === userId && a.sessionNumber === sessionNumber,
    );
  };

  const handleMarkAttendance = (
    userId: string,
    status: 'present' | 'absent' | 'excused',
  ) => {
    startTransition(async () => {
      const result = await markAttendance({
        userId,
        ...(entityType === 'club'
          ? { clubId: entityId }
          : { eventId: entityId }),
        sessionNumber: selectedSession,
        status,
      });

      if (result.success) {
        setLocalAttendance((prev) => {
          const idx = prev.findIndex(
            (a) =>
              a.userId === userId &&
              a.sessionNumber === selectedSession,
          );
          const newRecord: Attendance = {
            id: result.data?.id || '',
            userId,
            clubId: entityType === 'club' ? entityId : null,
            eventId: entityType === 'event' ? entityId : null,
            sessionNumber: selectedSession,
            status,
            notes: null,
            markedAt: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          if (idx >= 0) {
            const updated = [...prev];
            updated[idx] = { ...updated[idx], status };
            return updated;
          }
          return [...prev, newRecord];
        });
        toast({ description: `Attendance marked as ${status}` });
      } else {
        toast({ variant: 'destructive', description: result.message });
      }
    });
  };

  const handleSendMessage = () => {
    startTransition(async () => {
      const result = await sendMessageToParticipants(
        entityId,
        entityType,
        { subject, message },
      );

      if (result.success) {
        toast({ description: result.message });
        setMessageOpen(false);
        setSubject('');
        setMessage('');
      } else {
        toast({ variant: 'destructive', description: result.message });
      }
    });
  };

  const statusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircleIcon className='h-4 w-4 text-green-600' />;
      case 'absent':
        return <XCircleIcon className='h-4 w-4 text-red-600' />;
      case 'excused':
        return <MinusCircleIcon className='h-4 w-4 text-amber-600' />;
      default:
        return <MinusCircleIcon className='h-4 w-4 text-muted-foreground' />;
    }
  };

  const sessionOptions = Array.from(
    { length: totalSessions },
    (_, i) => i + 1,
  );

  return (
    <div className='space-y-6'>
      {/* Summary + Message Action */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex gap-4'>
          <Badge variant='default' className='text-sm'>
            {activeParticipants.length} Active
          </Badge>
          <Badge variant='secondary' className='text-sm'>
            {cancelledParticipants.length} Cancelled
          </Badge>
        </div>

        <Dialog open={messageOpen} onOpenChange={setMessageOpen}>
          <DialogTrigger asChild>
            <Button className='gap-1'>
              <SendIcon className='h-4 w-4' />
              Message All Participants
            </Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-lg'>
            <DialogHeader>
              <DialogTitle>Send Message to Participants</DialogTitle>
              <DialogDescription>
                This message will be sent to all {activeParticipants.length}{' '}
                active participants of &quot;{entityTitle}&quot;.
              </DialogDescription>
            </DialogHeader>
            <div className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='subject'>Subject</Label>
                <Input
                  id='subject'
                  placeholder='Message subject...'
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='message'>Message</Label>
                <Textarea
                  id='message'
                  placeholder='Type your message...'
                  className='min-h-32'
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant='outline'
                onClick={() => setMessageOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendMessage}
                disabled={
                  isPending ||
                  subject.length < 3 ||
                  message.length < 10
                }
              >
                {isPending ? 'Sending...' : 'Send Message'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Attendance Tracking */}
      <Card>
        <CardHeader>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
            <div>
              <CardTitle className='flex items-center gap-2'>
                <CalendarCheckIcon className='h-5 w-5' />
                Attendance Tracking
              </CardTitle>
              <CardDescription>
                Mark attendance for each session
              </CardDescription>
            </div>
            <div className='flex items-center gap-2'>
              <Label htmlFor='session-select'>Session:</Label>
              <Select
                value={String(selectedSession)}
                onValueChange={(v) => setSelectedSession(Number(v))}
              >
                <SelectTrigger className='w-32' id='session-select'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sessionOptions.map((s) => (
                    <SelectItem key={s} value={String(s)}>
                      Session {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {activeParticipants.length === 0 ? (
            <p className='py-8 text-center text-muted-foreground'>
              No active participants yet.
            </p>
          ) : (
            <div className='space-y-3'>
              {activeParticipants.map((participant) => {
                const user = participant.user;
                if (!user) return null;

                const attendance = getAttendanceForUser(
                  user.id,
                  selectedSession,
                );

                return (
                  <div
                    key={participant.id}
                    className='flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between'
                  >
                    <div className='flex items-center gap-3'>
                      {user.image ? (
                        <Image
                          src={user.image}
                          alt={user.name}
                          width={40}
                          height={40}
                          className='rounded-full'
                        />
                      ) : (
                        <div className='flex h-10 w-10 items-center justify-center rounded-full bg-muted'>
                          <UserIcon className='h-5 w-5 text-muted-foreground' />
                        </div>
                      )}
                      <div>
                        <p className='font-medium'>{user.name}</p>
                        <div className='flex items-center gap-1 text-sm text-muted-foreground'>
                          <MailIcon className='h-3 w-3' />
                          {user.email}
                        </div>
                        <p className='text-xs text-muted-foreground'>
                          Joined{' '}
                          {format(
                            new Date(participant.registeredAt),
                            'PPP',
                          )}
                        </p>
                      </div>
                    </div>

                    <div className='flex items-center gap-2'>
                      <span className='mr-2 flex items-center gap-1 text-sm'>
                        {statusIcon(attendance?.status || 'unmarked')}
                        <span className='capitalize'>
                          {attendance?.status || 'Unmarked'}
                        </span>
                      </span>
                      <Button
                        size='sm'
                        variant={
                          attendance?.status === 'present'
                            ? 'default'
                            : 'outline'
                        }
                        onClick={() =>
                          handleMarkAttendance(user.id, 'present')
                        }
                        disabled={isPending}
                        className='gap-1'
                      >
                        <CheckCircleIcon className='h-3.5 w-3.5' />
                        Present
                      </Button>
                      <Button
                        size='sm'
                        variant={
                          attendance?.status === 'absent'
                            ? 'destructive'
                            : 'outline'
                        }
                        onClick={() =>
                          handleMarkAttendance(user.id, 'absent')
                        }
                        disabled={isPending}
                        className='gap-1'
                      >
                        <XCircleIcon className='h-3.5 w-3.5' />
                        Absent
                      </Button>
                      <Button
                        size='sm'
                        variant={
                          attendance?.status === 'excused'
                            ? 'secondary'
                            : 'outline'
                        }
                        onClick={() =>
                          handleMarkAttendance(user.id, 'excused')
                        }
                        disabled={isPending}
                        className='gap-1'
                      >
                        <MinusCircleIcon className='h-3.5 w-3.5' />
                        Excused
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cancelled Participants */}
      {cancelledParticipants.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className='text-sm font-medium'>
              Cancelled Registrations ({cancelledParticipants.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-2'>
              {cancelledParticipants.map((p) => {
                const user = p.user;
                if (!user) return null;
                return (
                  <div
                    key={p.id}
                    className='flex items-center gap-3 rounded-lg border border-dashed p-3 opacity-60'
                  >
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={user.name}
                        width={32}
                        height={32}
                        className='rounded-full'
                      />
                    ) : (
                      <div className='flex h-8 w-8 items-center justify-center rounded-full bg-muted'>
                        <UserIcon className='h-4 w-4 text-muted-foreground' />
                      </div>
                    )}
                    <div className='flex-1'>
                      <p className='text-sm font-medium'>{user.name}</p>
                      <p className='text-xs text-muted-foreground'>
                        {user.email}
                      </p>
                    </div>
                    <Badge variant='destructive' className='text-xs'>
                      Cancelled
                      {p.cancelledAt &&
                        ` on ${format(new Date(p.cancelledAt), 'PP')}`}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
