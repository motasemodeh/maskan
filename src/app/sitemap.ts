import { MetadataRoute } from 'next';
import { getProperties } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://maskan.jo';
  const properties = await getProperties(true); // only available

  const staticRoutes = ['', '/properties'];
  const locales = ['en', 'ar'];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Home and listing routes for both languages
  for (const locale of locales) {
    for (const route of staticRoutes) {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: route === '' ? 1.0 : 0.8,
      });
    }

    // Property details routes
    for (const property of properties) {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}/properties/${property.id}`,
        lastModified: new Date(property.updatedAt || property.createdAt),
        changeFrequency: 'weekly',
        priority: 0.9,
      });
    }
  }

  return sitemapEntries;
}
