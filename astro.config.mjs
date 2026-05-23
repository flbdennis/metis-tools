// Astro 配置文件
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // 网站 URL
  site: 'https://metistools.com',
  // 静态输出
  output: 'static',
  // URL 末尾不加斜杠
  trailingSlash: 'never',
  // 集成
  integrations: [
    tailwind(),
    sitemap({
      // 默认包含所有静态页面，这里过滤掉禁用页面
      filter: (page) => !page.includes('/tools/mp4-to-gif'),
      // 最后修改日期
      lastmod: new Date(),
    }),
  ],
  // 构建优化
  build: {
    // CSS 内联
    inlineStylesheets: 'auto',
  },
  // Vite 配置
  vite: {
    build: {
      // 使用 esbuild 压缩（Vite 内置）
      minify: 'esbuild',
      // 代码分割
      rollupOptions: {
        // gifenc 仅用于 mp4-to-gif（未启用），外置避免构建错误
        external: ['gifenc'],
        output: {
          manualChunks: {
            'flowbite': ['flowbite'],
            'pdf': ['pdf-lib', 'pdfjs-dist'],
          },
        },
      },
    },
    esbuild: {
      // 去除 console 和 debugger
      drop: ['console', 'debugger'],
      // 去除所有注释
      legalComments: 'none',
    },
  },
});
