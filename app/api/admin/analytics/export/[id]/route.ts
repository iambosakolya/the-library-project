import { auth } from '@/auth';
import { getAnalyticsReport } from '@/lib/actions/analytics.actions';
import { NextRequest, NextResponse } from 'next/server';

function flattenForCSV(
  data: Record<string, unknown>,
  prefix = '',
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (Array.isArray(value)) {
      value.forEach((item, idx) => {
        if (typeof item === 'object' && item !== null) {
          Object.assign(
            result,
            flattenForCSV(
              item as Record<string, unknown>,
              `${fullKey}[${idx}]`,
            ),
          );
        } else {
          result[`${fullKey}[${idx}]`] = item;
        }
      });
    } else if (typeof value === 'object' && value !== null) {
      Object.assign(
        result,
        flattenForCSV(value as Record<string, unknown>, fullKey),
      );
    } else {
      result[fullKey] = value;
    }
  }
  return result;
}

function jsonToCSV(data: Record<string, unknown>): string {
  const rows: string[][] = [];

  for (const [sectionName, sectionData] of Object.entries(data)) {
    if (Array.isArray(sectionData) && sectionData.length > 0) {
      rows.push([`--- ${sectionName} ---`]);
      const headers = Object.keys(sectionData[0] as Record<string, unknown>);
      rows.push(headers);
      for (const item of sectionData) {
        const obj = item as Record<string, unknown>;
        rows.push(headers.map((h) => String(obj[h] ?? '')));
      }
      rows.push([]);
    } else if (
      typeof sectionData === 'object' &&
      sectionData !== null &&
      !Array.isArray(sectionData)
    ) {
      rows.push([`--- ${sectionName} ---`]);
      const flat = flattenForCSV(sectionData as Record<string, unknown>);
      rows.push(['Key', 'Value']);
      for (const [k, v] of Object.entries(flat)) {
        rows.push([k, String(v ?? '')]);
      }
      rows.push([]);
    } else {
      rows.push([sectionName, String(sectionData ?? '')]);
    }
  }

  return rows
    .map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','),
    )
    .join('\n');
}

function jsonToPDFHTML(report: {
  title: string;
  category: string;
  period: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  data: Record<string, unknown>;
}): string {
  let tables = '';

  for (const [sectionName, sectionData] of Object.entries(report.data)) {
    const label = sectionName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (s) => s.toUpperCase());

    if (Array.isArray(sectionData) && sectionData.length > 0) {
      const headers = Object.keys(sectionData[0] as Record<string, unknown>);
      tables += `<h2 style="margin-top:24px;color:#1a1a2e;">${label}</h2>
        <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
          <thead><tr>${headers.map((h) => `<th style="border:1px solid #ddd;padding:8px;background:#f4f4f4;text-align:left;">${h}</th>`).join('')}</tr></thead>
          <tbody>${sectionData
            .map(
              (item) =>
                `<tr>${headers
                  .map(
                    (h) =>
                      `<td style="border:1px solid #ddd;padding:8px;">${String((item as Record<string, unknown>)[h] ?? '')}</td>`,
                  )
                  .join('')}</tr>`,
            )
            .join('')}
          </tbody>
        </table>`;
    } else if (
      typeof sectionData === 'object' &&
      sectionData !== null &&
      !Array.isArray(sectionData)
    ) {
      const flat = flattenForCSV(sectionData as Record<string, unknown>);
      tables += `<h2 style="margin-top:24px;color:#1a1a2e;">${label}</h2>
        <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
          <thead><tr><th style="border:1px solid #ddd;padding:8px;background:#f4f4f4;">Key</th><th style="border:1px solid #ddd;padding:8px;background:#f4f4f4;">Value</th></tr></thead>
          <tbody>${Object.entries(flat)
            .map(
              ([k, v]) =>
                `<tr><td style="border:1px solid #ddd;padding:8px;">${k}</td><td style="border:1px solid #ddd;padding:8px;">${v}</td></tr>`,
            )
            .join('')}
          </tbody>
        </table>`;
    }
  }

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>${report.title}</title></head>
<body style="font-family:Arial,sans-serif;max-width:900px;margin:0 auto;padding:32px;">
  <h1 style="color:#1a1a2e;border-bottom:2px solid #1a1a2e;padding-bottom:8px;">${report.title}</h1>
  <p><strong>Category:</strong> ${report.category.replace(/_/g, ' ')}</p>
  <p><strong>Period:</strong> ${new Date(report.startDate).toLocaleDateString()} – ${new Date(report.endDate).toLocaleDateString()}</p>
  <p><strong>Generated:</strong> ${new Date(report.createdAt).toLocaleString()}</p>
  ${tables}
  <hr style="margin-top:40px;"><p style="color:#999;font-size:12px;">The Library Project – Analytics Report</p>
</body></html>`;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (session?.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = req.nextUrl;
  const format = searchParams.get('format') ?? 'json';

  try {
    const { id } = await params;
    const report = await getAnalyticsReport(id);

    switch (format) {
      case 'json': {
        return new NextResponse(JSON.stringify(report, null, 2), {
          headers: {
            'Content-Type': 'application/json',
            'Content-Disposition': `attachment; filename="analytics-report-${report.id}.json"`,
          },
        });
      }
      case 'csv': {
        const csv = jsonToCSV(report.data as Record<string, unknown>);
        return new NextResponse(csv, {
          headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="analytics-report-${report.id}.csv"`,
          },
        });
      }
      case 'pdf': {
        const html = jsonToPDFHTML(report);
        return new NextResponse(html, {
          headers: {
            'Content-Type': 'text/html',
            'Content-Disposition': `attachment; filename="analytics-report-${report.id}.html"`,
          },
        });
      }
      default:
        return NextResponse.json(
          { error: 'Invalid format. Use json, csv, or pdf.' },
          { status: 400 },
        );
    }
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Failed to export report' },
      { status: 500 },
    );
  }
}
