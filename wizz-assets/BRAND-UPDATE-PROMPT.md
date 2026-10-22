# Wizz Jewels — Brand Update: real logo, real work, new direction

The client's real logo and photos of his work are now in the project. They change the brief. **Where this file conflicts with the original brief, this file wins.** Everything else in the original brief (booking system, admin, motion system, accessibility, performance, tests) still applies.

Before changing anything, look at every image in `public/brand/` and `public/work/` yourself. Then give me a short summary of what you'll change, and go.

---

## 1. Assets (already prepared, already web-optimised, metadata stripped)

Copy the `brand/`, `favicon/` and `work/` folders from the `wizz-assets` folder I've given you into `public/` (not this markdown file), so you end up with:

```
public/
  brand/
    logo/wizz-logo-original.png         # the logo exactly as supplied, cropped, 900x1140, on pure black
    logo/wizz-logo-square.png           # 1080x1080, on pure black
    logo/wizz-logo-portrait-4x5.png     # 1080x1350, on pure black
    logo/wizz-logo-landscape-16x9.png   # 1920x1080, on pure black
    og/og-default.png                   # 1200x630 social share image
  favicon/ favicon.ico, icon-16/32/192/512.png, apple-touch-icon.png   # whole logo, square, on black
  work/
    pave-dome-ring-portrait.jpg / pave-dome-ring-square.jpg
    diamond-tennis-chain-portrait.jpg / diamond-tennis-chain-landscape.jpg
    iced-grillz-portrait.jpg / iced-grillz-landscape.jpg
```

- Remove the placeholder text wordmark and every Unsplash placeholder that these replace. Wire the favicon set and `og-default.png` into metadata and the web manifest.
- The logo files are the client's original artwork, **unaltered** — just cropped and padded with black. They are rasters, not vectors. **Do not** cut the logo apart, remove its background, separate the wordmark from the emblem, recolour, trace or redraw it. Always use it whole. Use `next/image` with explicit sizes.
- Every logo file sits on **pure `#000000`**, so it only blends seamlessly on a `#000000` background. Any section that shows the logo must use exactly `#000000` behind it (no gradients or `#0A0A0C` directly behind it), and the logo must never appear on light sections.
- **Header:** the logo is tall (emblem above script), so use `wizz-logo-original.png` as a compact mark about 56–64px tall (72px on large screens), on a pure-black header background. When the header becomes "solid with blur" on scroll, it must stay pure black behind the logo. Show the full logo large in the hero/intro, footer and loader.
- Use `wizz-logo-square.png` for square slots (loader, social avatars, email header), `wizz-logo-landscape-16x9.png` for wide banners, and `wizz-logo-portrait-4x5.png` for tall slots.

## 2. New brand direction (replaces section 2 of the original brief)

The real brand is **not** "quiet luxury / ivory maison". The logo is a **glowing neon-gold line illustration**: a diamond-shaped frame containing a starry night sky, a diamond orbited like a planet by a ring, floating gems, sparkles, mountains, and a flowing gold script "Wizz Jewels". The work is **iced-out, statement jewellery**: VVS pavé grillz with fangs, diamond tennis chains in rose gold, pavé dome rings with coloured stones.

So the site should feel like: **dark, cosmic, glowing, confident, luxury streetwear-meets-fine-jewellery.** Premium, not tacky. Think "night sky with gold light", not "gaming neon".

**Palette** (sampled from the logo; replace the old tokens):
- `--void` `#000000` — main background (must match the logo's black exactly)
- `--night` `#0A0A0C` / `--night-2` `#141418` — raised surfaces, cards
- `--gold-bright` `#E0B979` — highlights, headings accents, hover
- `--gold` `#C98A3A` — primary accent, buttons, hairlines
- `--gold-deep` `#A16320` — glow shadows, pressed states
- `--ember` `#5B300A` — outer glow / gradients only
- `--ice` `#E9EEF5` — body text and "diamond white" accents
- `--smoke` `#8A8A93` — secondary text
- Drop the ivory light sections. The site is dark-first throughout. Contrast still has to pass WCAG AA (check gold text sizes).

**Typography:**
- Headings: a refined serif with character (keep Cormorant Garamond, or try Bodoni Moda); use italics sparingly to echo the script logo.
- Body/UI: Manrope or Inter.
- **Do not** use a script font for headings. The script belongs to the logo only.

**Signature visual motifs** (pulled from the logo; use with restraint):
- **Gold glow:** text and line elements can carry a soft layered `text-shadow`/`drop-shadow` in `--gold`/`--gold-deep` like the logo's neon. Use it on key moments (hero headline, active nav item, CTAs on hover), not everywhere.
- **Starfield:** a subtle, slow, parallax star/dust layer (canvas or CSS, tiny gold and white points, a few four-point sparkles like the logo's) behind the hero and booking page. Low density, GPU-cheap, paused when offscreen, static under reduced motion.
- **Line-diamond geometry:** thin 1px gold line-art diamonds/rhombus frames as section ornaments, image masks and dividers, echoing the logo's frame. Image cards can sit in a rhombus-cornered frame or reveal through a diamond-shaped clip-path on scroll.
- **Orbit ring:** a thin elliptical gold ring (like the one around the logo's planet-diamond) can circle the hero's featured piece or the booking CTA, slowly rotating.
- **Sparkle glints:** on hover over jewellery images, a small four-point sparkle glints once across the stones. Keep it subtle and occasional.

## 3. Motion updates (add to the existing motion system)

- **Intro/loader (first visit only, ≤ 1.8s, skippable, session-cached):** pure black screen → the full logo (`wizz-logo-square.png`) fades in from dark with a soft brightness bloom, then a gold light-sweep mask passes across it → site fades up. Respect reduced motion (instant fade).
- **Logo in header:** gentle glow "breathing" on idle is OK only if very slow and low amplitude. Light-sweep shimmer when the header first becomes solid.
- **Hero:** the starfield drifts with pointer position (tiny parallax) and scroll. Hero headline letters ignite from dim to glowing gold in a stagger.
- **Buttons:** primary buttons are dark with a gold hairline border. On hover the border glows, a light sweep runs across, and the button stays magnetic. On press, a brief bloom.
- **Gallery hover:** image scales slightly, a gold line-diamond frame draws in around it, and a sparkle glint runs across.
- Keep everything premium: one hero moment per section, no constant flashing, everything at 60fps.

## 4. Content & collection updates

**Collection categories** (replace the old ones): **Grillz · Chains · Rings · Pendants · Custom**. Filter animation stays the same.

**Real pieces** (create entries in `content/` and use these as the featured items; keep placeholders for other slots but clearly mark them `TODO: client photo` in the data file, not on the live site; hide placeholder items in production unless I say otherwise):

1. **Iced Fang Grillz** — Grillz. White gold, VVS pavé-set diamonds across 8 teeth with two high-polish solid fangs. Custom moulded. Images: `iced-grillz-landscape.jpg` (hero/featured), `iced-grillz-portrait.jpg` (detail).
2. **Rose Gold Diamond Tennis Chain** — Chains. Rose gold, a continuous line of round brilliant diamonds. Images: `diamond-tennis-chain-landscape.jpg`, `diamond-tennis-chain-portrait.jpg`. (Lifestyle shot, worn.)
3. **Amethyst Pavé Dome Ring** — Rings. Rose gold dome ring, fully pavé-set with white diamonds and scattered purple stones. Images: `pave-dome-ring-square.jpg`, `pave-dome-ring-portrait.jpg`.

Write materials/descriptions as confident but **not invented specs**. No carat weights, clarity grades, or prices unless they're in a clearly marked `TODO: confirm with client` field. List these in your final report as things I need to confirm.

**Consultation types** (update the booking config):
- Custom Grillz (includes mould/fitting discussion)
- Custom Chains & Pendants
- Rings & Engagement
- Repairs, Resizing & Re-plating
- General Enquiry

**Copy tone:** confident, warm, a bit of swagger, still premium. Short lines. E.g. hero: "Made to shine. Made for you." / "Custom grillz, chains and fine jewellery, handcrafted by Wizz." Keep all copy in `content/` so I can edit it.

## 5. Photo handling

These are good phone photos with real-life backgrounds (a sofa, a T-shirt, blue velvet). Make them look premium without faking them:
- Present them on dark cards with generous padding, consistent aspect ratios per layout (use the square/landscape/portrait variants provided), `object-fit: cover` with sensible `object-position` per image (store a focal point per image in content).
- Apply a single consistent, subtle grade via CSS on the cards (very slight contrast lift and vignette overlay that fades into the black background). Never use heavy filters that change the metal or stone colours.
- No AI-generated or stock images of jewellery presented as his work. Any remaining placeholder visuals should be abstract (starfield, line-art diamonds, gold gradients), not fake products.
- The tennis chain photo shows part of a person's chin. Default to `object-position` that keeps the focus on the chain.

## 6. Done when

- Real logo, favicon and OG image are live everywhere; no placeholder branding remains.
- The new dark cosmic-gold direction is applied consistently across every page, including emails (React Email templates should use the black background, gold accents and the logo PNG from the absolute site URL) and the admin dashboard.
- The three real pieces appear on Home (featured) and in Collection with working detail pages and "Enquire about this piece" pre-filling the booking form with the matching consultation type.
- Lint, typecheck, build and all tests pass. Then screenshot every page at 390px and 1440px, review them critically against this file, fix anything that looks cheap, and send me the screenshots plus a list of everything I still need from the client (more photos, prices, address, opening hours, socials, booking email, real testimonials).

**Nice-to-have, ask me first:** if a vector (SVG/AI/EPS) version of the logo turns up later, the line-art could be animated as a stroke "draw-on". Don't attempt it with the PNG.
