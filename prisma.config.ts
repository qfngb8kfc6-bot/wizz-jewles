import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    // Read directly (not via env()) so `prisma generate` during `npm install`
    // works before DATABASE_URL is configured, e.g. on a fresh Vercel project.
    // Migrations and the app itself still require it at runtime.
    url: process.env.DATABASE_URL ?? '',
  },
});
