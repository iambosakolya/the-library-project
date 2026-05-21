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
import { goalTrackerStyles as styles } from './styles';

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
      <CardHeader className={styles.cardHeader}>
        <CardTitle className={styles.headerTitle}>
          <Target className={styles.headerIcon} />
          Goal Tracking ({new Date().getFullYear()})
        </CardTitle>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => setShowForm(!showForm)}
          className={styles.addButton}
        >
          <Plus className={styles.addButtonIcon} />
          Add Goal
        </Button>
      </CardHeader>
      <CardContent>
        {/* Add goal form */}
        {showForm && (
          <div className={styles.formWrapper}>
            <div className={styles.formFieldFull}>
              <label className={styles.formLabel}>Goal Type</label>
              <Select value={newType} onValueChange={setNewType}>
                <SelectTrigger className='h-9'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='books_to_read'>
                    <span className='flex items-center gap-2'>
                      <BookOpen className={styles.selectIcon} />
                      Books to Read
                    </span>
                  </SelectItem>
                  <SelectItem value='reviews_to_write'>
                    <span className='flex items-center gap-2'>
                      <PenTool className={styles.selectIcon} />
                      Reviews to Write
                    </span>
                  </SelectItem>
                  <SelectItem value='events_to_attend'>
                    <span className='flex items-center gap-2'>
                      <CalendarCheck className={styles.selectIcon} />
                      Events to Attend
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className={styles.formFieldSmall}>
              <label className={styles.formLabel}>Target</label>
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
          <p className={styles.emptyState}>
            No goals set yet. Start by adding a reading goal!
          </p>
        ) : (
          <div className={styles.goalsList}>
            {data.map((goal) => (
              <div key={goal.id} className={styles.goalItem}>
                <div className={styles.goalHeader}>
                  <span className={styles.goalLabel}>
                    {(() => {
                      const config = TYPE_CONFIG[goal.type];
                      if (config) {
                        const GoalIcon = config.icon;
                        return <GoalIcon className={styles.goalLabelIcon} />;
                      }
                      return null;
                    })()}
                    {TYPE_CONFIG[goal.type]?.label || goal.type}
                  </span>
                  <div className={styles.goalStats}>
                    <span className={styles.goalCurrent}>
                      {goal.current}{' '}
                      <span className={styles.goalTarget}>/ {goal.target}</span>
                    </span>
                    <Button
                      variant='ghost'
                      size='icon'
                      className={styles.deleteButton}
                      onClick={() => onDelete(goal.id)}
                    >
                      <Trash2 className={styles.deleteIcon} />
                    </Button>
                  </div>
                </div>
                <div className={styles.progressBar}>
                  <div
                    className={`${styles.progressFill} ${TYPE_COLORS[goal.type] || 'bg-primary'}`}
                    style={{ width: `${goal.percentage}%` }}
                  />
                </div>
                <div className={styles.progressInfo}>
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
