export async function GET() {
    // 你的网站域名
    const site = import.meta.env.SITE || 'https://metis-tools.pages.dev';

    // 自动生成 sitemap 地址
    const sitemapUrl = new URL('/sitemap.xml', site).href;

    // 生成 robots.txt 内容
    const body = `User-agent: *
Allow: /
Sitemap: ${sitemapUrl}`;

    return new Response(body, {
        headers: {
            'Content-Type': 'text/plain',
        },
    });
}