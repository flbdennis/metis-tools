// generate-sitemap.js
const { glob } = require('glob');
const { writeFileSync, readdirSync, existsSync, readFileSync } = require('fs');
const path = require('path');

// 确保 __dirname 可用（在 CommonJS 中默认存在，这里显式定义也无妨）
if (typeof __dirname === 'undefined') {
  var __dirname = path.dirname(module.filename);
}

// 读取 astro.config.mjs 并提取 site 字段
const configPath = path.join(process.cwd(), 'astro.config.mjs');
const configContent = readFileSync(configPath, 'utf-8');
// 用正则匹配 site: '...' 或 site: "..."
const siteMatch = configContent.match(/site:\s*['"]([^'"]+)['"]/);
if (!siteMatch) {
  throw new Error('未在 astro.config.mjs 中找到 site 配置');
}
const baseUrl = siteMatch[1]; // 你的网站基础 URL，末尾无斜杠

// 需要排除的文件或目录
const ignorePatterns = [
  '**/_*/**',              // 以下划线开头的文件/文件夹（组件、布局等）
  '**/api/**',             // API 路由（如果有）
  '**/support/**',         // 法律页面，手动添加，避免自动扫描
  '**/blog/[...slug].astro', // 动态路由，不直接生成（博客文章会手动添加）
  // '**/tools/*.astro',    // 工具页面是静态的，不要排除（已注释）
];

// 获取所有 .astro 页面（同步）
const pages = glob.sync('src/pages/**/*.astro', {
  ignore: ignorePatterns,
  absolute: false,
});

// 辅助函数：将文件路径转换为 URL 路径
function toRoute(filePath) {
  let route = filePath
    .replace(/^src\/pages/, '')
    .replace(/\.astro$/, '')
    .replace(/\/index$/, '');
  if (route === '') route = '/';
  if (!route.startsWith('/')) route = '/' + route;
  return route;
}

// 收集所有页面 URL
const urls = new Set();

for (const file of pages) {
  const route = toRoute(file);
  // 排除不需要的路径
  if (route.includes('/_') || route.includes('/components/')) continue;
  urls.add(route);
}

// 手动添加法律页面（因为 support 目录被排除）
const manualPages = [
  '/support/about',
  '/support/contact',
  '/support/privacy-policy',
  '/blog',               // 博客列表页
];
manualPages.forEach(p => urls.add(p));

// 添加博客文章（从 src/content/blog/ 读取 .md 文件）
const blogDir = path.join(process.cwd(), 'src/content/blog');
if (existsSync(blogDir)) {
  const blogFiles = readdirSync(blogDir).filter(f => f.endsWith('.md'));
  blogFiles.forEach(file => {
    const slug = file.replace(/\.md$/, '');
    urls.add(`/blog/${slug}`);
  });
} else {
  console.warn('⚠️ 博客目录不存在，跳过博客文章添加');
}

// 可选：添加所有工具页面（已经通过 glob 扫描，无需额外添加）

// 生成 sitemap XML
const sitemapUrls = Array.from(urls).sort().map(url => {
  const priority = url === '/' ? '1.0' : '0.8';
  return `  <url>
    <loc>${baseUrl}${url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;
}).join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls}
</urlset>`;

// 写入到 public 目录
const outputPath = path.join(process.cwd(), 'public/sitemap.xml');
writeFileSync(outputPath, sitemap);
console.log(`✅ Sitemap generated successfully! Total URLs: ${urls.size}`);
console.log(`📍 Output: ${outputPath}`);