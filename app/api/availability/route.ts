import { NextResponse, type NextRequest } from 'next/server';
import { availability } from '@/config/availability';
import { getConsultationType } from '@/config/consultations';
import { addDaysToKey, availableDaysInMonth, dateKeyOf, generateDaySlots, isDateKey, lastBookableDate } from '@/lib/availability';
import { findBookingByToken, loadAvailabilityContext } from '@/lib/booking';

/**
 * GET /api/availability?type=grillz&month=2026-11  → bookable days in that month
 * GET /api/availability?type=grillz&date=2026-11-04 → start times on that day
 * Optional `token` excludes the caller's own booking (rescheduling).
 */
export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const type = getConsultationType(params.get('type') ?? '');
  if (!type) return NextResponse.json({ error: 'Unknown consultation type' }, { status: 400 });

  const token = params.get('token');
  const own = token ? await findBookingByToken(token) : null;
  const excludeBookingId = own?.id;
  const headers = { 'Cache-Control': 'no-store' };

  const date = params.get('date');
  if (date) {
    if (!isDateKey(date)) return NextResponse.json({ error: 'Invalid date' }, { status: 400 });
    const ctx = await loadAvailabilityContext(date, date, { excludeBookingId });
    return NextResponse.json(
      { date, timeZone: availability.timeZone, slots: generateDaySlots(date, type.duration, ctx) },
      { headers },
    );
  }

  const month = params.get('month');
  if (!month || !/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
    return NextResponse.json({ error: 'Provide month=YYYY-MM or date=YYYY-MM-DD' }, { status: 400 });
  }
  const from = `${month}-01`;
  const to = addDaysToKey(addDaysToKey(from, 31).slice(0, 7) + '-01', -1);
  const ctx = await loadAvailabilityContext(from, to, { excludeBookingId });
  return NextResponse.json(
    {
      month,
      timeZone: availability.timeZone,
      today: dateKeyOf(ctx.now, availability.timeZone),
      lastDate: lastBookableDate(ctx),
      days: availableDaysInMonth(month, type.duration, ctx),
    },
    { headers },
  );
}
