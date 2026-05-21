'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { exportDataButtonStyles as styles } from './styles';

export default function ExportDataButton() {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const res = await fetch('/api/personal-analytics?section=export');
      if (!res.ok) throw new Error('Export failed');
      const data = await res.json();

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `reading-data-${new Date().toISOString().slice(0, 10)}.json`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      variant='outline'
      onClick={handleExport}
      disabled={isExporting}
      className={styles.button}
    >
      {isExporting ? (
        <Loader2 className={styles.spinner} />
      ) : (
        <Download className={styles.icon} />
      )}
      Export My Data
    </Button>
  );
}
