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
import type { Report } from '../shared/types';
import {
  headerStyles,
  tableStyles,
  paginationStyles,
  statusColors,
} from './styles';

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

  const getStatusColor = (status: string) => {
    return statusColors[status] ?? statusColors.default;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className={headerStyles.title}>
          <Archive className={headerStyles.icon} />
          Report Archive
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className={tableStyles.loadingText}>Loading reports...</p>
        ) : reports.length === 0 ? (
          <p className={tableStyles.emptyText}>
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
                        className={getStatusColor(report.status)}
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
                              className={tableStyles.actionButton}
                              onClick={() => exportReport(report.id, 'json')}
                              title='Export as JSON'
                            >
                              <FileJson className={tableStyles.actionIcon} />
                            </Button>
                            <Button
                              size='icon'
                              variant='ghost'
                              className={tableStyles.actionButton}
                              onClick={() => exportReport(report.id, 'csv')}
                              title='Export as CSV'
                            >
                              <FileSpreadsheet
                                className={tableStyles.actionIcon}
                              />
                            </Button>
                            <Button
                              size='icon'
                              variant='ghost'
                              className={tableStyles.actionButton}
                              onClick={() => exportReport(report.id, 'pdf')}
                              title='Export as PDF'
                            >
                              <FileText className={tableStyles.actionIcon} />
                            </Button>
                          </>
                        )}
                        <Button
                          size='icon'
                          variant='ghost'
                          className={tableStyles.deleteButton}
                          onClick={() => deleteReport(report.id)}
                          title='Delete report'
                        >
                          <Trash2 className={tableStyles.actionIcon} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className={paginationStyles.wrapper}>
              <p className={paginationStyles.text}>
                Page {page} of {totalPages}
              </p>
              <div className={paginationStyles.buttons}>
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
