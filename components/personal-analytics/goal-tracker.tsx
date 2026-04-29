'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Target,
  Plus,
  Trash2,
  BookOpen,
  PenTool,
  CalendarCheck,
  type LucideIcon,
} from 'lucide-react';
import type { GoalData } from '@/lib/actions/personal-analytics.actions';

const TYPE_CONFIG: Record<string, { label: string; icon: LucideIcon }> = {
  books_to_read: { label: 'Books to Read', icon: BookOpen },
  reviews_to_write: { label: 'Reviews to Write', icon: PenTool },
  events_to_attend: { label: 'Events to Attend', icon: CalendarCheck },
};

const TYPE_COLORS: Record<string, string> = {
  books_to_read: 'bg-indigo-500',
  reviews_to_write: 'bg-emerald-500',
  events_to_attend: 'bg-amber-500',
};

export default function GoalTracker({
  data,
  onUpsert,
  onDelete,
}: {
  data: GoalData[];
  onUpsert: (type: string, target: number) => void;
  onDelete: (goalId: string) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [newType, setNewType] = useState('books_to_read');
  const [newTarget, setNewTarget] = useState('12');

  const handleAdd = () => {
    const target = parseInt(newTarget);
    if (target > 0) {
      onUpsert(newType, target);
      setShowForm(false);
      setNewTarget('12');
    }
  };

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle className='flex items-center gap-2'>
          <Target className='h-5 w-5 text-rose-500' />
          Goal Tracking ({new Date().getFullYear()})
        </CardTitle>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => setShowForm(!showForm)}
          className='gap-1'
        >
          <Plus className='h-4 w-4' />
          Add Goal
        </Button>
      </CardHeader>
      <CardContent>
        {/* Add goal form */}
        {showForm && (
          <div className='mb-4 flex items-end gap-2 rounded-lg border p-3'>
            <div className='flex-1'>
              <label className='mb-1 block text-xs text-muted-foreground'>
                Goal Type
              </label>
              <Select value={newType} onValueChange={setNewType}>
                <SelectTrigger className='h-9'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='books_to_read'>
                    <span className='flex items-center gap-2'>
                      <BookOpen className='h-4 w-4 text-indigo-500' />
                      Books to Read
                    </span>
                  </SelectItem>
                  <SelectItem value='reviews_to_write'>
                    <span className='flex items-center gap-2'>
                      <PenTool className='h-4 w-4 text-emerald-500' />
                      Reviews to Write
                    </span>
                  </SelectItem>
                  <SelectItem value='events_to_attend'>
                    <span className='flex items-center gap-2'>
                      <CalendarCheck className='h-4 w-4 text-amber-500' />
                      Events to Attend
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='w-24'>
              <label className='mb-1 block text-xs text-muted-foreground'>
                Target
              </label>
              <Input
                type='number'
                min={1}
                value={newTarget}
                onChange={(e) => setNewTarget(e.target.value)}
                className='h-9'
              />
            </div>
            <Button size='sm' onClick={handleAdd} className='h-9'>
              Save
            </Button>
          </div>
        )}

        {/* Goals list */}
        {data.length === 0 ? (
          <p className='py-8 text-center text-muted-foreground'>
            No goals set yet. Start by adding a reading goal!
          </p>
        ) : (
          <div className='space-y-4'>
            {data.map((goal) => (
              <div key={goal.id} className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <span className='flex items-center gap-2 text-sm font-medium'>
                    {(() => {
                      const config = TYPE_CONFIG[goal.type];
                      if (config) {
                        const GoalIcon = config.icon;
                        return <GoalIcon className='h-4 w-4' />;
                      }
                      return null;
                    })()}
                    {TYPE_CONFIG[goal.type]?.label || goal.type}
                  </span>
                  <div className='flex items-center gap-2'>
                    <span className='text-sm font-bold'>
                      {goal.current}{' '}
                      <span className='text-muted-foreground'>
                        / {goal.target}
                      </span>
                    </span>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-6 w-6'
                      onClick={() => onDelete(goal.id)}
                    >
                      <Trash2 className='h-3 w-3 text-muted-foreground' />
                    </Button>
                  </div>
                </div>
                <div className='h-3 w-full overflow-hidden rounded-full bg-muted'>
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${TYPE_COLORS[goal.type] || 'bg-primary'}`}
                    style={{ width: `${goal.percentage}%` }}
                  />
                </div>
                <div className='flex justify-between text-xs text-muted-foreground'>
                  <span>{goal.percentage}% complete</span>
                  <span>
                    {goal.target - goal.current > 0
                      ? `${goal.target - goal.current} remaining`
                      : 'Goal reached!'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
