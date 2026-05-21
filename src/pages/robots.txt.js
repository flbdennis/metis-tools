// robots.txt 生成 —— SEO 爬虫指引
import { siteConfig } from '../data/site';

export async function GET() {
  const sitemapUrl = new URL('/sitemap.xml', siteConfig.url).href;

  const content = [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${sitemapUrl}`,
  ].join('\n');

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
