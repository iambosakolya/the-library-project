import { useState, useCallback } from 'react';
import { type WidgetConfig } from './shared/types';
import { DEFAULT_WIDGETS } from './widget-customizer/constants';

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
