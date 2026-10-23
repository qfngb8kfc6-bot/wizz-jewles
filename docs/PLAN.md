# Wizz Jewels — Build Plan

## Change of plan (overrides the original brief where they differ)

- **No generated jewellery imagery.** The three.js renderer and all rendered images have been deleted. The site shows only the client's real work.
- **Exactly three pieces**, photographed by the client (`public/work/`, copied from `wizz-assets/work/`):
  | Piece                          | Slug                             | Photos                                                                    |
  | ------------------------------ | -------------------------------- | ------------------------------------------------------------------------- |
  | Iced Fang Grillz               | `iced-fang-grillz`               | `iced-grillz-landscape.jpg`, `iced-grillz-portrait.jpg`                   |
  | Rose Gold Diamond Tennis Chain | `rose-gold-diamond-tennis-chain` | `diamond-tennis-chain-landscape.jpg`, `diamond-tennis-chain-portrait.jpg` |
  | Amethyst Pavé Dome Ring        | `amethyst-pave-dome-ring`        | `pave-dome-ring-square.jpg`, `pave-dome-ring-portrait.jpg`                |
- **Collection**: no category filter. An editorial page with one large, generous showcase per piece, plus detail pages at `/collection/[slug]` (gallery of the two photos, lightbox, "Enquire about this piece" → prefilled booking).
- **Home featured**: the three pieces in a pinned horizontal scroll on desktop and a swipe carousel on mobile. Swap to a staggered editorial layout if three cards look sparse when pinned.
- **Hero, craft, process, about**: the real photos (cropped and reused tastefully), the real logo, and abstract visuals only (starfield, gold line-art diamonds, gradients). No product renders.
- **Brand** (`wizz-assets/BRAND-UPDATE-PROMPT.md`, applied): dark cosmic-gold palette on pure `#000000` (`void`, `night`, `night-2`, `gold-bright`, `gold`, `gold-deep`, `ember`, `ice`, `smoke`), no ivory anywhere. The real logo PNGs are used whole and unaltered, always on `#000`. Signature motifs: starfield, line-art diamonds, orbit ring, sparkle glints, gold glow, first-visit logo intro. Consultation types: Custom Grillz · Custom Chains & Pendants · Rings & Engagement · Repairs, Resizing & Re-plating · General Enquiry. Each piece's "Enquire" button preselects its matching type.
- **Collection vs brand file §4:** the brand file asks for a category filter (Grillz · Chains · Rings · Pendants · Custom) and placeholder slots. Per the client's direct instruction this site shows exactly the three real pieces, with no filter and no placeholders; each piece still carries its category label.
- **Assets:** `wizz-assets/brand`, `favicon` and `work` copied to `public/`.

## Stack

Next.js 16 (App Router, Cache Components, React 19.3 `<ViewTransition>`), TypeScript strict, Tailwind v4 (`@theme` tokens in `app/globals.css`), `motion`, Lenis, GSAP ScrollTrigger (pinned showcase only, lazy-loaded), Prisma 7 + PostgreSQL (driver adapter `pg`), Zod (shared schemas), React Hook Form, Resend → Nodemailer → local `.outbox/` fallback, React Email, Vercel Blob (private) for reference uploads, Vitest, Playwright.

## Structure

```
app/            routes: (site) public pages, admin/, api/
components/     ui/, motion/, layout/, sections/
content/        all copy and image references (edit here, not in components)
config/         availability.ts, consultations.ts
lib/            availability (pure), booking service, auth, email, uploads, rate-limit, validation
emails/         React Email templates
prisma/         schema, migrations, seed
tests/          unit/ (Vitest), e2e/ (Playwright)
```

## Data model

`Booking`, `BookingSlot` (one row per occupied 15-minute cell, unique on `start`, which prevents double booking across different durations), `BlockedDate`, `NewsletterSubscriber`, `ContactMessage`, `RateLimit`.

## Motion system

`lib/motion.ts` (easing `[0.22, 1, 0.36, 1]`, durations 0.2/0.5/0.9s, variants) plus `Reveal`, `StaggerGroup`, `SplitText`, `Parallax`, `MagneticButton`, `Marquee`, `ScrollProgress`, `Counter`, `SmoothScroll` (Lenis), `Cursor`. Route transitions use native view transitions, with a shared-element morph from collection to detail. Everything degrades under `prefers-reduced-motion`.

## Phases

1. Scaffold, tokens, layout, motion primitives — written, not yet verified in the browser
2. Home · 3. Collection + detail · 4. About/Bespoke/Contact/Legal/404
3. Booking flow, availability, emails, cancel/reschedule — service layer written
4. Admin · 7. A11y/responsive · 8. Perf/SEO · 9. Tests · 10. QA + screenshots
