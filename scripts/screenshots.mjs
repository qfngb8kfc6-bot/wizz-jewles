// QA helper: full-page screenshots of every route at 390px and 1440px, plus
// any console errors. Usage: node scripts/screenshots.mjs [baseUrl] [outDir] [routes...]
import { mkdir } from 'node:fs/promises';
import { chromium } from '@playwright/test';

const base = process.argv[2] ?? 'http://localhost:3000';
const out = process.argv[3] ?? 'screenshots';
const routes = process.argv.slice(4).length
  ? process.argv.slice(4)
  : [
      '/',
      '/collection',
      '/collection/iced-fang-grillz',
      '/about',
      '/bespoke',
      '/contact',
      '/book',
      '/privacy',
      '/terms',
      '/cookies',
      '/this-page-does-not-exist',
      '/admin/login',
    ];

await mkdir(out, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM_PATH || undefined });
const errors = [];
for (const [label, viewport] of [
  ['390', { width: 390, height: 844 }],
  ['1440', { width: 1440, height: 900 }],
]) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1, reducedMotion: 'no-preference' });
  // Skip the first-visit intro for screenshots.
  await context.addInitScript(() => {
    try {
      sessionStorage.setItem('wj_intro_seen', '1');
    } catch {
      // cross-origin frames (e.g. the map) have no storage access
    }
  });
  for (const route of routes) {
    const page = await context.newPage();
    page.on('console', (m) => m.type() === 'error' && errors.push(`${label} ${route}: ${m.text()}`));
    page.on('pageerror', (e) => errors.push(`${label} ${route}: ${e.message}`));
    await page.goto(base + route, { waitUntil: 'networkidle' });
    // Scroll through so reveal-on-scroll content is triggered, then back to top.
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < height; y += 500) {
      await page.mouse.wheel(0, 500);
      await page.waitForTimeout(120);
    }
    await page.waitForTimeout(1200);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(800);
    const name = route === '/' ? 'home' : route.slice(1).replace(/\//g, '_');
    await page.screenshot({ path: `${out}/${name}-${label}.png`, fullPage: true });
    await page.close();
  }
  await context.close();
}
await browser.close();
console.log(errors.length ? errors.join('\n') : 'No console errors');
