// Astro 配置文件
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // 网站 URL，部署时改为最终域名
  site: 'https://esay-tools.pages.dev',
  // 输出静态 HTML
  output: 'static',
  // URL 末尾不添加斜杠
  trailingSlash: 'never',
  integrations: [tailwind(),sitemap()],
});