// Astro 配置文件
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  // 网站 URL，部署时改为最终域名
  site: 'https://metis-tools.pages.dev',
  // 输出静态 HTML
  output: 'static',
  // URL 末尾不添加斜杠
  trailingSlash: 'never',
  integrations: [tailwind()],
});