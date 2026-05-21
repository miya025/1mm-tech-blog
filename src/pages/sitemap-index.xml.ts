import type { APIContext } from 'astro';

export const prerender = true;

function getSiteUrl(site: URL | undefined): string {
  return (site ?? new URL('https://miyadev.com')).origin;
}

export function GET(context: APIContext) {
  const site = getSiteUrl(context.site);
  const body = `<?xml version="1.0" encoding="UTF-8"?>` +
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
    `<sitemap><loc>${site}/sitemap-0.xml</loc></sitemap>` +
    `</sitemapindex>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
