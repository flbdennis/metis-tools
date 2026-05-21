// 导航菜单配置 —— 所有导航相关文本统一管理

export const navigationConfig = {
  // ===== 主导航菜单 =====
  mainNav: [
    {
      label: 'Home',
      href: '/',
      icon: null,
    },
    {
      label: 'Calculators',
      href: '/calculators',
      description: 'BMI, Age, Tip, Loan, Percentage, Date, Unit converters',
    },
    {
      label: 'Converters',
      href: '/converters',
      description: 'PDF, Currency, file format converters',
    },
    {
      label: 'Developer Tools',
      href: '/dev-tools',
      description: 'JSON, JWT, UUID, Regex, Code formatters',
    },
    {
      label: 'Image Tools',
      href: '/image-tools',
      description: 'Compress, convert, crop, resize images',
    },
    {
      label: 'Text Tools',
      href: '/text-tools',
      description: 'Case converter, encoder, text stats, sort & shuffle',
    },
    {
      label: 'Blog',
      href: '/blog',
    },
  ],

  // ===== 辅助导航（About/Contact 等） =====
  secondaryNav: [
    { label: 'About', href: '/support/about' },
    { label: 'Contact', href: '/support/contact' },
    { label: 'FAQ', href: '/support/faq' },
  ],

  // ===== 页脚链接 =====
  footerLinks: {
    tools: {
      title: 'Tools',
      links: [
        { label: 'Calculators', href: '/calculators' },
        { label: 'Converters', href: '/converters' },
        { label: 'Developer Tools', href: '/dev-tools' },
        { label: 'Image Tools', href: '/image-tools' },
        { label: 'Text Tools', href: '/text-tools' },
      ],
    },
    support: {
      title: 'Support',
      links: [
        { label: 'About', href: '/support/about' },
        { label: 'Contact', href: '/support/contact' },
        { label: 'FAQ', href: '/support/faq' },
        { label: 'Blog', href: '/blog' },
      ],
    },
    legal: {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '/support/privacy-policy' },
        { label: 'Terms of Service', href: '/support/terms' },
      ],
    },
  },

  // ===== 分类映射（slug → 分类名 + URL） =====
  categoryMap: {
    calculators: { name: 'Calculators', href: '/calculators' },
    converters: { name: 'Converters', href: '/converters' },
    dev: { name: 'Developer Tools', href: '/dev-tools' },
    image: { name: 'Image Tools', href: '/image-tools' },
    text: { name: 'Text Tools', href: '/text-tools' },
  },
};
