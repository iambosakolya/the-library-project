'use client';

import { useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface ExportChartButtonProps {
  chartRef: React.RefObject<HTMLDivElement | null>;
  filename?: string;
}

export default function ExportChartButton({
  chartRef,
  filename = 'chart',
}: ExportChartButtonProps) {
  const handleExport = useCallback(async () => {
    const el = chartRef.current;
    if (!el) return;

    try {
      // Use html2canvas dynamically
      const { default: html2canvas } = await import('html2canvas');
      const canvas = await html2canvas(el, {
        backgroundColor: null,
        scale: 2,
        logging: false,
      });

      const link = document.createElement('a');
      link.download = `${filename}-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch {
      // Fallback: use SVG serialization for Recharts
      const svgEl = el.querySelector('svg');
      if (!svgEl) return;

      const svgData = new XMLSerializer().serializeToString(svgEl);
      const svgBlob = new Blob([svgData], {
        type: 'image/svg+xml;charset=utf-8',
      });

      const link = document.createElement('a');
      link.download = `${filename}-${new Date().toISOString().slice(0, 10)}.svg`;
      link.href = URL.createObjectURL(svgBlob);
      link.click();
      URL.revokeObjectURL(link.href);
    }
  }, [chartRef, filename]);

  return (
    <Button
      variant='ghost'
      size='sm'
      onClick={handleExport}
      className='h-7 gap-1 text-xs text-muted-foreground hover:text-foreground'
    >
      <Download className='h-3 w-3' />
      Export
    </Button>
  );
}

/** Hook to create a chart ref + export button pair */
export function useChartExport(filename?: string) {
  const chartRef = useRef<HTMLDivElement>(null);

  const ExportButton = useCallback(
    () => <ExportChartButton chartRef={chartRef} filename={filename} />,
    [filename],
  );

  return { chartRef, ExportButton };
}
