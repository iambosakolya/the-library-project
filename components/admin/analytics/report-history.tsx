'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  FileJson,
  FileSpreadsheet,
  FileText,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Archive,
} from 'lucide-react';

interface Report {
  id: string;
  category: string;
  title: string;
  period: string;
  startDate: string;
  endDate: string;
  status: string;
  progress: number;
  version: number;
  createdAt: string;
  user?: { name: string };
}

export default function ReportHistory() {
  const [reports, setReports] = useState<Report[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/analytics/reports?page=${page}&limit=10`,
      );
      const data = await res.json();
      setReports(data.reports ?? []);
      setTotalPages(data.totalPages ?? 1);
    } catch (err) {
      console.error('Failed to fetch reports:', err);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const deleteReport = async (id: string) => {
    if (!confirm('Delete this report?')) return;
    await fetch(`/api/admin/analytics/reports/${id}`, { method: 'DELETE' });
    fetchReports();
  };

  const exportReport = (id: string, format: string) => {
    window.open(`/api/admin/analytics/export/${id}?format=${format}`, '_blank');
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Archive className='h-5 w-5' />
          Report Archive
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className='py-8 text-center text-muted-foreground'>
            Loading reports...
          </p>
        ) : reports.length === 0 ? (
          <p className='py-8 text-center text-muted-foreground'>
            No reports generated yet. Use the dashboard above to generate your
            first report.
          </p>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Version</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className='font-medium'>
                      {report.title}
                    </TableCell>
                    <TableCell>{report.category.replace(/_/g, ' ')}</TableCell>
                    <TableCell>
                      {new Date(report.startDate).toLocaleDateString()} –{' '}
                      {new Date(report.endDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={statusColor(report.status)}
                        variant='outline'
                      >
                        {report.status}
                      </Badge>
                    </TableCell>
                    <TableCell>v{report.version}</TableCell>
                    <TableCell>
                      {new Date(report.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className='flex gap-1'>
                        {report.status === 'completed' && (
                          <>
                            <Button
                              size='icon'
                              variant='ghost'
                              className='h-7 w-7'
                              onClick={() => exportReport(report.id, 'json')}
                              title='Export as JSON'
                            >
                              <FileJson className='h-3.5 w-3.5' />
                            </Button>
                            <Button
                              size='icon'
                              variant='ghost'
                              className='h-7 w-7'
                              onClick={() => exportReport(report.id, 'csv')}
                              title='Export as CSV'
                            >
                              <FileSpreadsheet className='h-3.5 w-3.5' />
                            </Button>
                            <Button
                              size='icon'
                              variant='ghost'
                              className='h-7 w-7'
                              onClick={() => exportReport(report.id, 'pdf')}
                              title='Export as PDF'
                            >
                              <FileText className='h-3.5 w-3.5' />
                            </Button>
                          </>
                        )}
                        <Button
                          size='icon'
                          variant='ghost'
                          className='h-7 w-7 text-destructive'
                          onClick={() => deleteReport(report.id)}
                          title='Delete report'
                        >
                          <Trash2 className='h-3.5 w-3.5' />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className='mt-4 flex items-center justify-between'>
              <p className='text-sm text-muted-foreground'>
                Page {page} of {totalPages}
              </p>
              <div className='flex gap-2'>
                <Button
                  size='sm'
                  variant='outline'
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className='h-4 w-4' />
                </Button>
                <Button
                  size='sm'
                  variant='outline'
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  <ChevronRight className='h-4 w-4' />
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
