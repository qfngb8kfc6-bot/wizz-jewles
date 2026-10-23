import { getConsultationType } from '@/config/consultations';
import { isAdmin } from '@/lib/auth';
import { db } from '@/lib/db';

function csvCell(v: unknown) {
  const s = v == null ? '' : v instanceof Date ? v.toISOString() : String(v);
  // Quote, escape quotes, and neutralise spreadsheet formula injection.
  const safe = /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
  return `"${safe.replace(/"/g, '""')}"`;
}

/** GET /api/admin/export — all bookings as CSV (admin only). */
export async function GET() {
  if (!(await isAdmin())) return new Response('Unauthorised', { status: 401 });
  const bookings = await db.booking.findMany({ orderBy: { startsAt: 'desc' } });
  const header = [
    'Reference',
    'Status',
    'Starts (UTC)',
    'Ends (UTC)',
    'Duration',
    'Consultation',
    'Format',
    'Name',
    'Email',
    'Phone',
    'Contact method',
    'Budget',
    'Piece',
    'Message',
    'Has image',
    'Notes',
    'Created (UTC)',
  ];
  const rows = bookings.map((b) =>
    [
      b.reference,
      b.status,
      b.startsAt,
      b.endsAt,
      b.durationMinutes,
      getConsultationType(b.consultationType)?.name ?? b.consultationType,
      b.format,
      b.name,
      b.email,
      b.phone,
      b.contactMethod,
      b.budget,
      b.pieceSlug,
      b.message,
      b.referenceImage ? 'yes' : 'no',
      b.adminNotes,
      b.createdAt,
    ]
      .map(csvCell)
      .join(','),
  );
  const csv = '﻿' + [header.map(csvCell).join(','), ...rows].join('\r\n');
  const day = new Date().toISOString().slice(0, 10);
  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="wizz-jewels-bookings-${day}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}
