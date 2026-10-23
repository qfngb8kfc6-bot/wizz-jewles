# Wizz Jewels

Website for **Wizz Jewels**: custom grillz, chains, pendants and fine jewellery, handcrafted by Wizz. Dark, cosmic-gold, motion-rich, with a fully working consultation booking system and a studio dashboard.

Built with Next.js 16 (App Router, Cache Components, React 19.3 view transitions), TypeScript (strict), Tailwind CSS v4, `motion`, Lenis, GSAP ScrollTrigger (one pinned showcase), Prisma 7 + PostgreSQL, Zod, React Hook Form, React Email + Resend/Nodemailer, Vitest and Playwright.

---

## Quick start

```bash
cp .env.example .env            # then fill in the values (see below)
docker compose up -d            # local Postgres on :5432 (or point DATABASE_URL at Neon/Supabase)
npm install                     # also runs `prisma generate`
npm run db:migrate              # create tables
npm run db:seed                 # optional: sample bookings + a blocked date
npm run admin:hash -- "a long admin password"   # paste the output into .env
npm run dev                     # http://localhost:3000
```

Without an email provider configured, development emails (customer confirmation, studio notification, `.ics` invite) are written to `./.outbox/` so you can open them in a browser.

### Scripts

| Script                                                       | What it does                                                                                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| `npm run dev` / `build` / `start`                            | Next.js                                                                                                                              |
| `npm run lint` · `typecheck` · `format`                      | ESLint, TypeScript (`next typegen && tsc`), Prettier                                                                                 |
| `npm test`                                                   | Vitest: slot generation (incl. DST), calendar files, auth, validation, and a real-Postgres double-booking concurrency test           |
| `npm run test:e2e`                                           | Playwright: booking happy path, slot conflict, invalid form, mobile menu, collection → detail → lightbox → enquire, admin login, 404 |
| `npm run db:migrate` · `db:deploy` · `db:seed` · `db:studio` | Prisma                                                                                                                               |
| `npm run admin:hash -- "password"`                           | Prints `ADMIN_PASSWORD_HASH=…`                                                                                                       |
| `node scripts/screenshots.mjs [url] [outDir]`                | Full-page QA screenshots of every route at 390px and 1440px                                                                          |

Playwright uses its own browsers by default; set `PW_CHROMIUM_PATH` to use a system Chromium, and `PW_BASE_URL` to test an already-running server.

---

## Environment variables

All are documented in [`.env.example`](.env.example).

| Variable                                                              | Required           | Purpose                                                                                     |
| --------------------------------------------------------------------- | ------------------ | ------------------------------------------------------------------------------------------- |
| `DATABASE_URL`                                                        | yes                | Postgres connection string                                                                  |
| `NEXT_PUBLIC_SITE_URL`                                                | yes (prod)         | Canonical origin for metadata, sitemap, emails and calendar links                           |
| `ADMIN_PASSWORD_HASH`                                                 | yes                | scrypt hash from `npm run admin:hash`                                                       |
| `SESSION_SECRET`                                                      | yes                | 32+ random characters; signs the admin session cookie                                       |
| `STUDIO_NOTIFICATION_EMAIL`                                           | recommended        | Where new booking and contact notifications go                                              |
| `RESEND_API_KEY`, `EMAIL_FROM`                                        | one email provider | Transactional email via Resend (recommended)                                                |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD` | alternative        | Nodemailer fallback                                                                         |
| `BLOB_READ_WRITE_TOKEN`                                               | prod               | Private Vercel Blob store for booking reference images (local dev uses `./storage/uploads`) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`              | optional           | Cloudflare Turnstile on the booking and contact forms (enabled only when both are set)      |

---

## Editing content

Everything a client might want to change lives in **`content/`** and **`config/`**. Components never contain copy.

| File                                                                                                      | Contents                                                                                                                                                                          |
| --------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `content/site.ts`                                                                                         | Business name, navigation, and the `contactDetails` block (address, phone, email, hours, socials) behind a `published` flag                                                       |
| `content/pieces.ts`                                                                                       | The collection (name, category, materials, description, specs, images, matching consultation type). Specs left empty and listed under `toConfirm` until the client confirms them. |
| `content/images.ts`                                                                                       | Every jewellery photo, with dimensions and a **focal point** used for cropping                                                                                                    |
| `content/brand.ts`                                                                                        | Logo files                                                                                                                                                                        |
| `content/home.ts`, `about.ts`, `bespoke.ts`, `process.ts`, `collection.ts`, `testimonials.ts`, `legal.ts` | Page copy                                                                                                                                                                         |

### Placeholder content and the `published` flags

Nothing invented renders on the site. Blocks that still need the client's real content are switched off with a `published: false` flag in `content/`; each one reappears everywhere it is used as soon as the real content is added and the flag is set to `true`:

| Flag                       | File                      | What it controls while `false`                                                                                                                                                                                                |
| -------------------------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `contactDetails.published` | `content/site.ts`         | Address, phone, email, opening hours, socials and map are hidden from the footer, mobile menu, contact page, emails, calendar invites and JSON-LD. The contact page and footer point to the contact form and booking instead. |
| `testimonials.published`   | `content/testimonials.ts` | The testimonials section on the home page                                                                                                                                                                                     |
| `craft.stats.published`    | `content/home.ts`         | The animated stats counters on the home page                                                                                                                                                                                  |
| `timeline.published`       | `content/about.ts`        | The "story so far" timeline on the About page                                                                                                                                                                                 |

The E2E suite (`tests/e2e/placeholders.spec.ts`) fails if any placeholder text renders. While contact details are unpublished, set `STUDIO_NOTIFICATION_EMAIL` so booking and contact notifications still reach the studio.

### Photos

Only the client's real work is shown, from `public/work/`. To add or replace a photo:

1. Put the file in `public/work/` (JPG/PNG/WebP; next/image serves AVIF/WebP at responsive sizes automatically).
2. Add or update its entry in `content/images.ts` with `width`, `height`, `alt` and `focus` (the percentage point that must stay in frame when cropped, e.g. `{ x: 58, y: 72 }`).
3. Reference it from a piece in `content/pieces.ts`.

All photos get the same subtle grade via the `.photo-grade` class (a slight contrast lift and a vignette into the black page); no filter changes metal or stone colours.

**Never crop beyond native resolution.** Crops come only from `object-fit: cover` inside a frame; photos are never scaled up to fake a tighter crop. `<Photo>` requests enough pixels for the visible crop automatically (`lib/photo-sizes.ts`), and `tests/unit/photo-sizes.test.ts` lists every crop on the site and checks it stays sharp at 2× device pixels. Add a row there when you add a new crop. The tennis chain is always shown from its landscape photo (the portrait one is mostly T-shirt) except in the piece gallery, where photos are shown whole.

### Logo

The logo files in `public/brand/logo/` are the client's original artwork, only cropped and padded with pure black. They are always used **whole and unaltered**, and only on `#000000` (`bg-void`). Use the `<Logo variant="original | square | portrait | landscape" height={…} />` component.

### Adding a piece

Add an entry to `content/pieces.ts`. The collection page, home showcase, detail page (`/collection/[slug]`), sitemap and Product structured data all update automatically.

---

## Availability and booking

`config/availability.ts` controls everything the booking calendar offers:

- `hours`: opening hours per weekday (`0` = Sunday). Remove a day to close it.
- `slotStepMinutes`: spacing between offered start times
- `bufferMinutes`: quiet time kept free after each appointment
- `leadTimeHours`: minimum notice (24 means no same-day bookings)
- `maxDaysAhead`: booking horizon
- `blockedDates`: fixed closures. Staff can also block dates from `/admin/blocked`.

`config/consultations.ts` holds the consultation types and their durations, the in-studio/video options and the budget ranges.

**How double booking is prevented:** each booking occupies one `BookingSlot` row per 15-minute cell of its duration plus buffer, and `BookingSlot.start` is unique. Bookings are created inside a transaction after re-checking availability, so even simultaneous requests for overlapping times of different lengths cannot both succeed. The loser gets a `409`, and the booking UI refreshes the calendar. All times are computed in `Europe/London` with correct DST handling, and visitors in other time zones see their local time alongside.

Customers receive a confirmation with an `.ics` invite and a private tokenised link (`/booking/<token>`) to reschedule or cancel. Only a hash of the token is stored.

---

## Studio dashboard

Go to **`/admin`** and sign in with the password you hashed into `ADMIN_PASSWORD_HASH`. The session is an HMAC-signed, httpOnly, `SameSite=Strict` cookie, valid for 12 hours. Login attempts are rate limited.

- **Bookings:** upcoming, past and cancelled; open any booking to see its details and reference image, change its status (confirmed/completed/cancelled; cancelling emails the customer and frees the slot), and keep private notes.
- **Export CSV:** all bookings.
- **Blocked dates:** close the studio on given days.
- **Enquiries:** contact form messages and the newsletter subscriber count.

---

## Deploying to Vercel

1. Create a Postgres database (Neon or Supabase) and copy its connection string.
2. Import the repository into Vercel. The `vercel-build` script runs `prisma generate && prisma migrate deploy && next build`, so migrations apply on every deploy.
3. Add the environment variables above (Production and Preview).
4. Create a **private** Blob store (Vercel → Storage → Blob) and connect it to the project; this sets `BLOB_READ_WRITE_TOKEN`.
5. In Resend, verify the sending domain and set `EMAIL_FROM` to an address on it.
6. Deploy, then visit `/admin` to confirm you can sign in.

---

## Project structure

```
app/            (site) public pages · admin/ dashboard · api/ route handlers · sitemap/robots/manifest
components/     ui/ · motion/ (Reveal, StaggerGroup, SplitText, IgniteText, Parallax, Magnetic, Marquee,
                ScrollProgress, Counter, SmoothScroll, Cursor) · visual/ (Starfield, ornaments, Intro)
                · sections/ · booking/ · layout/ · admin/
content/        copy, photos, logo, collection
config/         availability, consultation types
lib/            availability (pure), booking service, auth, email, uploads, rate limiting, validation, SEO
emails/         React Email templates
prisma/         schema, migrations, seed
tests/          unit/ · integration/ · e2e/
```

### Motion

Shared timing lives in `lib/motion.ts` (signature ease `[0.22, 1, 0.36, 1]`, durations 0.2/0.5/0.9s, shared variants). Only transform and opacity are animated. With `prefers-reduced-motion`, smooth scrolling, the custom cursor, parallax, the starfield drift, the marquee and the large transitions switch off, leaving simple fades. Content stays visible if JavaScript fails: a `no-js` class keeps every reveal-animated element shown, and the first-visit intro only plays when a script marks it.
