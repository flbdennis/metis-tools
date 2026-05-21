// 站点全局配置 —— 所有公用字符串的唯一来源
// 页面和组件中禁止硬编码以下任何值，统一从此处引用

export const siteConfig = {
  // ===== 基础信息 =====
  name: 'MetisTools',
  tagline: 'Free Online Tools — No Signup Required',
  description: 'All-in-one toolkit: file conversion, unit conversion, health, finance, daily math tools, and developer utilities. 100% free, no signup required.',
  url: 'https://metistools.com',
  locale: 'en_US',

  // ===== 联系信息 =====
  email: 'flbdennis.fan@gmail.com',
  orgName: 'MetisTools',
  developer: 'MetisTools Team',

  // ===== 社交媒体链接 =====
  social: {
    twitter: 'https://twitter.com/metistools',
    facebook: 'https://facebook.com/metistools',
    linkedin: 'https://linkedin.com/company/metistools',
    reddit: 'https://reddit.com/r/metistools',
    pinterest: 'https://pinterest.com/metistools',
    instagram: 'https://instagram.com/metistools',
    whatsapp: '', // 通过 Web Share API 动态生成
  },

  // ===== 第三方服务 ID =====
  googleAnalyticsId: 'G-87VGYW1H47',
  googleAdsenseId: 'ca-pub-3912115209665374',

  // ===== 联系方式 =====
  contact: {
    email: 'flbdennis.fan@gmail.com',
    responseTime: '24-48 hours',
  },

  // ===== 版权信息 =====
  copyright: `© ${new Date().getFullYear()} MetisTools. All rights reserved.`,

  // ===== 页面路由 =====
  routes: {
    home: '/',
    blog: '/blog',
    about: '/support/about',
    contact: '/support/contact',
    faq: '/support/faq',
    privacy: '/support/privacy-policy',
    terms: '/support/terms',
  },

  // ===== 构建配置 =====
  build: {
    // 上线日期（用于 sitemap）
    launchDate: '2024-01-01',
  },
};
