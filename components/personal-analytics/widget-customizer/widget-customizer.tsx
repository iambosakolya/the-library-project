'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { GripVertical, Eye, EyeOff, LayoutDashboard, Save } from 'lucide-react';
import { widgetCustomizerStyles as styles } from './styles';

export type WidgetConfig = {
  id: string;
  label: string;
  visible: boolean;
  order: number;
};

const DEFAULT_WIDGETS: WidgetConfig[] = [
  { id: 'streak', label: 'Reading Streak', visible: true, order: 0 },
  { id: 'goals', label: 'Goal Tracking', visible: true, order: 1 },
  { id: 'timeline', label: 'Activity Timeline', visible: true, order: 2 },
  { id: 'genres', label: 'Genre Preferences', visible: true, order: 3 },
  { id: 'reviews', label: 'Review Stats', visible: true, order: 4 },
  { id: 'yearInBooks', label: 'Year in Books', visible: true, order: 5 },
  {
    id: 'participation',
    label: 'Participation History',
    visible: true,
    order: 6,
  },
  { id: 'interactions', label: 'Interaction Network', visible: true, order: 7 },
  { id: 'achievements', label: 'Achievements', visible: true, order: 8 },
  { id: 'privacy', label: 'Privacy Controls', visible: true, order: 9 },
];

export function useWidgetLayout(savedLayout?: Record<string, unknown> | null) {
  const [widgets, setWidgets] = useState<WidgetConfig[]>(() => {
    if (savedLayout && Array.isArray(savedLayout.widgets)) {
      return savedLayout.widgets as WidgetConfig[];
    }
    return DEFAULT_WIDGETS;
  });

  const [isCustomizing, setIsCustomizing] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const toggleVisibility = useCallback((id: string) => {
    setWidgets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, visible: !w.visible } : w)),
    );
  }, []);

  const handleDragStart = useCallback((index: number) => {
    setDraggedIndex(index);
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent, index: number) => {
      e.preventDefault();
      if (draggedIndex === null || draggedIndex === index) return;

      setWidgets((prev) => {
        const newWidgets = [...prev];
        const [removed] = newWidgets.splice(draggedIndex, 1);
        newWidgets.splice(index, 0, removed);
        return newWidgets.map((w, i) => ({ ...w, order: i }));
      });
      setDraggedIndex(index);
    },
    [draggedIndex],
  );

  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
  }, []);

  const saveLayout = useCallback(async () => {
    try {
      await fetch('/api/personal-analytics/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save-layout',
          layout: { widgets },
        }),
      });
    } catch (error) {
      console.error('Failed to save layout:', error);
    }
    setIsCustomizing(false);
  }, [widgets]);

  const visibleWidgets = widgets
    .filter((w) => w.visible)
    .sort((a, b) => a.order - b.order);

  return {
    widgets,
    visibleWidgets,
    isCustomizing,
    setIsCustomizing,
    toggleVisibility,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    draggedIndex,
    saveLayout,
  };
}

export function WidgetCustomizer({
  widgets,
  isCustomizing,
  setIsCustomizing,
  toggleVisibility,
  handleDragStart,
  handleDragOver,
  handleDragEnd,
  draggedIndex,
  saveLayout,
}: ReturnType<typeof useWidgetLayout>) {
  if (!isCustomizing) {
    return (
      <Button
        variant='outline'
        size='sm'
        onClick={() => setIsCustomizing(true)}
        className={styles.toggleButton}
      >
        <LayoutDashboard className={styles.toggleIcon} />
        Customize Dashboard
      </Button>
    );
  }

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <h3 className={styles.panelTitle}>Customize Dashboard Layout</h3>
        <div className={styles.panelActions}>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => setIsCustomizing(false)}
          >
            Cancel
          </Button>
          <Button size='sm' onClick={saveLayout} className='gap-1'>
            <Save className={styles.saveIcon} />
            Save Layout
          </Button>
        </div>
      </div>
      <p className={styles.hint}>
        Drag to reorder. Click the eye icon to show/hide widgets.
      </p>
      <div className={styles.itemList}>
        {widgets.map((widget, index) => (
          <div
            key={widget.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={`${styles.itemBase} ${
              draggedIndex === index ? styles.itemDragging : styles.itemIdle
            } ${!widget.visible ? styles.itemHidden : ''}`}
          >
            <GripVertical className={styles.gripIcon} />
            <span className={styles.itemLabel}>{widget.label}</span>
            <Button
              variant='ghost'
              size='icon'
              className={styles.visibilityButton}
              onClick={() => toggleVisibility(widget.id)}
            >
              {widget.visible ? (
                <Eye className={styles.eyeVisible} />
              ) : (
                <EyeOff className={styles.eyeHidden} />
              )}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
