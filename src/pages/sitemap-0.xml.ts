import type { APIContext } from 'astro';
import { getPosts } from '@/lib/notion/client';

export const prerender = true;

type SitemapUrl = {
  loc: string;
  lastmod?: string | null;
};

function getSiteUrl(site: URL | undefined): string {
  return (site ?? new URL('https://miyadev.com')).origin;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function createUrlEntry(url: SitemapUrl): string {
  const lastmod = url.lastmod ? `<lastmod>${escapeXml(url.lastmod)}</lastmod>` : '';
  return `<url><loc>${escapeXml(url.loc)}</loc>${lastmod}</url>`;
}

export async function GET(context: APIContext) {
  const site = getSiteUrl(context.site);
  const posts = await getPosts();
  const urls: SitemapUrl[] = [
    { loc: `${site}/` },
    { loc: `${site}/portfolio` },
    ...posts.map((post) => ({
      loc: `${site}/${post.slug}/`,
      lastmod: post.publishedDate,
    })),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
    urls.map(createUrlEntry).join('') +
    `</urlset>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
