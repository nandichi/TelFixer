import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://telfixer.nl';

  // Statische pagina's
  const staticPages = [
    '',
    '/producten',
    '/inleveren',
    '/over-ons',
    '/contact',
    '/faq',
    '/garantie',
    '/tracking',
  ];

  const staticRoutes = staticPages.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly' as const,
    priority: route === '' ? 1 : route === '/producten' ? 0.9 : 0.7,
  }));

  return staticRoutes;
}
