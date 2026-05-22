'use client';

import { Button } from '@/components/ui/button';
import { GripVertical, Eye, EyeOff, LayoutDashboard, Save } from 'lucide-react';
import { widgetCustomizerStyles as styles } from './styles';
import { useWidgetLayout } from '../use-widget-layout';

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
