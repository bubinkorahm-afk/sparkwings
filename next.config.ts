import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Embedded Postgres for local dev — load from node_modules, don't bundle (WASM + data files)
  serverExternalPackages: ['@electric-sql/pglite'],
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
  // "/" → /en or /ar is handled by proxy.ts (Accept-Language).
  // Old-site URL → new-page 301s get added here in Iteration 8.
  async redirects() {
    return [];
  },
};

export default withNextIntl(nextConfig);
