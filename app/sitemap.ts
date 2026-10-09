import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';

/** Pages that exist today. Add each new page here as it ships (Iterations 4–6). */
const paths = ['', '/about'];

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.map(path => ({
    url: `${site.url}/en${path}`,
    changeFrequency: path === '' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : 0.7,
    alternates: {
      languages: {
        'en-IN': `${site.url}/en${path}`,
        'en-SA': `${site.url}/en${path}`,
        'ar-SA': `${site.url}/ar${path}`,
        'x-default': `${site.url}/en${path}`,
      },
    },
  }));
}
