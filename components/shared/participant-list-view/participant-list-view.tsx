'use client';

import { useState, useTransition } from 'react';
import { Attendance } from '@/types';
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
import { type ParticipantListViewProps } from '../shared/types';

import {
  UserIcon,
  MailIcon,
  CheckCircleIcon,
  XCircleIcon,
  MinusCircleIcon,
  SendIcon,
  CalendarCheckIcon,
} from 'lucide-react';

import {
  participantStyles,
  messageDialogStyles,
  attendanceStyles,
  cancelledStyles,
} from './styles';

export default function ParticipantListView({
  participants,
  attendanceRecords,
  entityId,
  entityType,
  entityTitle,
  totalSessions,
}: ParticipantListViewProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [selectedSession, setSelectedSession] = useState(1);
  const [messageOpen, setMessageOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [localAttendance, setLocalAttendance] =
    useState<Attendance[]>(attendanceRecords);

  const activeParticipants = participants.filter((p) => p.status === 'active');
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
            (a) => a.userId === userId && a.sessionNumber === selectedSession,
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
      const result = await sendMessageToParticipants(entityId, entityType, {
        subject,
        message,
      });

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

  const sessionOptions = Array.from({ length: totalSessions }, (_, i) => i + 1);

  return (
    <div className={participantStyles.wrapper}>
      {/* Summary + Message Action */}
      <div className={participantStyles.summaryRow}>
        <div className={participantStyles.badgeRow}>
          <Badge variant='default' className={participantStyles.badgeText}>
            {activeParticipants.length} Active
          </Badge>
          <Badge variant='secondary' className={participantStyles.badgeText}>
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
          <DialogContent className={messageDialogStyles.content}>
            <DialogHeader>
              <DialogTitle>Send Message to Participants</DialogTitle>
              <DialogDescription>
                This message will be sent to all {activeParticipants.length}{' '}
                active participants of &quot;{entityTitle}&quot;.
              </DialogDescription>
            </DialogHeader>
            <div className={messageDialogStyles.formSection}>
              <div className={messageDialogStyles.inputGroup}>
                <Label htmlFor='subject'>Subject</Label>
                <Input
                  id='subject'
                  placeholder='Message subject...'
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              <div className={messageDialogStyles.inputGroup}>
                <Label htmlFor='message'>Message</Label>
                <Textarea
                  id='message'
                  placeholder='Type your message...'
                  className={messageDialogStyles.textarea}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant='outline' onClick={() => setMessageOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSendMessage}
                disabled={
                  isPending || subject.length < 3 || message.length < 10
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
          <div className={attendanceStyles.headerRow}>
            <div>
              <CardTitle className='flex items-center gap-2'>
                <CalendarCheckIcon className={attendanceStyles.titleIcon} />
                Attendance Tracking
              </CardTitle>
              <CardDescription>
                Mark attendance for each session
              </CardDescription>
            </div>
            <div className={attendanceStyles.sessionRow}>
              <Label htmlFor='session-select'>Session:</Label>
              <Select
                value={String(selectedSession)}
                onValueChange={(v) => setSelectedSession(Number(v))}
              >
                <SelectTrigger
                  className={attendanceStyles.sessionSelect}
                  id='session-select'
                >
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
            <p className={attendanceStyles.emptyText}>
              No active participants yet.
            </p>
          ) : (
            <div className={attendanceStyles.participantList}>
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
                    className={attendanceStyles.participantCard}
                  >
                    <div className={attendanceStyles.userRow}>
                      {user.image ? (
                        <Image
                          src={user.image}
                          alt={user.name}
                          width={40}
                          height={40}
                          className={attendanceStyles.avatar}
                        />
                      ) : (
                        <div className={attendanceStyles.avatarPlaceholder}>
                          <UserIcon className={attendanceStyles.avatarIcon} />
                        </div>
                      )}
                      <div>
                        <p className={attendanceStyles.userName}>{user.name}</p>
                        <div className={attendanceStyles.userEmail}>
                          <MailIcon className={attendanceStyles.emailIcon} />
                          {user.email}
                        </div>
                        <p className={attendanceStyles.joinDate}>
                          Joined{' '}
                          {format(new Date(participant.registeredAt), 'PPP')}
                        </p>
                      </div>
                    </div>

                    <div className={attendanceStyles.statusRow}>
                      <span className={attendanceStyles.statusLabel}>
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
                        onClick={() => handleMarkAttendance(user.id, 'present')}
                        disabled={isPending}
                        className={attendanceStyles.statusButton}
                      >
                        <CheckCircleIcon
                          className={attendanceStyles.statusIcon}
                        />
                        Present
                      </Button>
                      <Button
                        size='sm'
                        variant={
                          attendance?.status === 'absent'
                            ? 'destructive'
                            : 'outline'
                        }
                        onClick={() => handleMarkAttendance(user.id, 'absent')}
                        disabled={isPending}
                        className={attendanceStyles.statusButton}
                      >
                        <XCircleIcon className={attendanceStyles.statusIcon} />
                        Absent
                      </Button>
                      <Button
                        size='sm'
                        variant={
                          attendance?.status === 'excused'
                            ? 'secondary'
                            : 'outline'
                        }
                        onClick={() => handleMarkAttendance(user.id, 'excused')}
                        disabled={isPending}
                        className={attendanceStyles.statusButton}
                      >
                        <MinusCircleIcon
                          className={attendanceStyles.statusIcon}
                        />
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
            <CardTitle className={cancelledStyles.title}>
              Cancelled Registrations ({cancelledParticipants.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={cancelledStyles.list}>
              {cancelledParticipants.map((p) => {
                const user = p.user;
                if (!user) return null;
                return (
                  <div key={p.id} className={cancelledStyles.card}>
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={user.name}
                        width={32}
                        height={32}
                        className={cancelledStyles.avatarSmall}
                      />
                    ) : (
                      <div className={cancelledStyles.avatarPlaceholderSmall}>
                        <UserIcon className={cancelledStyles.avatarIconSmall} />
                      </div>
                    )}
                    <div className={cancelledStyles.info}>
                      <p className={cancelledStyles.name}>{user.name}</p>
                      <p className={cancelledStyles.email}>{user.email}</p>
                    </div>
                    <Badge
                      variant='destructive'
                      className={cancelledStyles.badge}
                    >
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
