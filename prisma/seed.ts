/**
 * Seeds a few blocked dates and sample bookings so the dashboard has content
 * in development. Safe to re-run. Never run against production data.
 */
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { addDays, addMinutes } from 'date-fns';
import { fromZonedTime } from 'date-fns-tz';
import { availability } from '../config/availability';
import { cellsFor } from '../lib/availability';
import { PrismaClient } from '../lib/generated/prisma/client';
import { createManageToken, createReference } from '../lib/tokens';

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });

/** Next date (from tomorrow + offset) that the studio is open. */
function nextOpenDay(offset: number) {
  let d = addDays(new Date(), 1 + offset);
  for (let i = 0; i < 14; i++) {
    const key = d.toISOString().slice(0, 10);
    if (availability.hours[d.getUTCDay() as 0] && !availability.blockedDates.includes(key)) return key;
    d = addDays(d, 1);
  }
  throw new Error('No open day found');
}

async function main() {
  if (process.env.NODE_ENV === 'production') throw new Error('Refusing to seed in production');

  await db.blockedDate.upsert({
    where: { date: '2026-12-27' },
    create: { date: '2026-12-27', reason: 'Studio stocktake' },
    update: {},
  });

  const samples = [
    {
      name: 'Jordan Ellis',
      email: 'jordan@example.com',
      type: 'grillz',
      format: 'IN_STUDIO',
      time: '11:00',
      day: 2,
      duration: 60,
    },
    { name: 'Sam Okafor', email: 'sam@example.com', type: 'chains', format: 'VIDEO', time: '14:30', day: 5, duration: 45 },
    { name: 'Alex Rivera', email: 'alex@example.com', type: 'rings', format: 'IN_STUDIO', time: '16:00', day: 9, duration: 60 },
  ] as const;

  for (const s of samples) {
    if (await db.booking.findFirst({ where: { email: s.email } })) continue;
    const startsAt = fromZonedTime(`${nextOpenDay(s.day)}T${s.time}:00`, availability.timeZone);
    await db.booking.create({
      data: {
        reference: createReference(),
        consultationType: s.type,
        format: s.format,
        startsAt,
        endsAt: addMinutes(startsAt, s.duration),
        durationMinutes: s.duration,
        name: s.name,
        email: s.email,
        phone: '+44 7700 900000',
        contactMethod: 'EMAIL',
        message: 'Seeded example booking.',
        manageTokenHash: createManageToken().hash,
        slots: {
          createMany: { data: cellsFor(startsAt, s.duration, availability.bufferMinutes).map((ms) => ({ start: new Date(ms) })) },
        },
      },
    });
  }
  console.log('Seed complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
