// 工具元数据配置 —— 所有工具的统一数据源
// 每个工具唯一 icon（Flowbite SVG），不重复

export const allTools = [
  // ===== 计算器类 (calculators) =====
  { title: 'BMI Calculator', description: 'Calculate your Body Mass Index instantly with metric or imperial units. Get BMI score, weight category, and healthy weight range.', icon: 'balance-scale', href: '/tools/bmi', category: 'calculators', blogSlug: 'bmi-calculator-guide-healthy-weight-tracking' },
  { title: 'Age Calculator', description: 'Calculate your exact age in years, months, and days. Includes countdown to next birthday, zodiac sign, and fun statistics.', icon: 'calendar-clock', href: '/tools/age', category: 'calculators', blogSlug: 'age-calculator-more-than-just-a-birthday-countdown' },
  { title: 'Tip Calculator', description: 'Calculate tip amount, total bill, and per-person share. Includes service quality presets, tax options, and bill splitting.', icon: 'currency-dollar', href: '/tools/tip', category: 'calculators', blogSlug: 'the-ultimate-guide-to-using-a-tip-calculator' },
  { title: 'CM to Inches', description: 'Convert centimeters to inches and feet+inches format. Bidirectional conversion with common length reference table.', icon: 'arrows-right-left', href: '/tools/cm-to-inches', category: 'calculators', blogSlug: 'unit-converter-101-how-to-convert-like-a-pro' },
  { title: 'lbs to kg', description: 'Convert pounds to kilograms and stones+pounds format. Bidirectional conversion with common weight reference table.', icon: 'scale-balanced', href: '/tools/lbs-to-kg', category: 'calculators', blogSlug: 'unit-converter-101-how-to-convert-like-a-pro' },
  { title: 'Loan Calculator', description: 'Calculate monthly payments, total interest, and view full amortization schedule. Supports extra payments and loan comparison.', icon: 'building-library', href: '/tools/loan-calculator', category: 'calculators', blogSlug: 'loan-calculator-guide-payments-interest' },
  { title: 'Unit Converter', description: 'Convert between metric and imperial units across 12 categories including length, weight, temperature, volume, speed, and more.', icon: 'adjustments-horizontal', href: '/tools/unit-converter', category: 'calculators', blogSlug: 'unit-converter-101-how-to-convert-like-a-pro' },
  { title: 'Percentage Calculator', description: 'Calculate percentages in multiple modes: X% of Y, X is what % of Y, percentage change, increase and decrease.', icon: 'chart-pie', href: '/tools/percentage-calculator', category: 'calculators', blogSlug: 'percentage-calculator-everyday-math' },
  { title: 'Date Difference', description: 'Calculate days, weeks, months, and years between two dates. Includes business day mode and date addition/subtraction.', icon: 'calendar-days', href: '/tools/date-difference', category: 'calculators', blogSlug: 'date-difference-calculator-tips' },

  // ===== 转换器类 (converters) =====
  { title: 'PDF Converter', description: 'Convert PDF to image, text, and HTML. Also merge, compress, split, rotate, and extract pages from PDF files.', icon: 'document-arrow-down', href: '/tools/pdf-converter', category: 'converters', blogSlug: 'how-to-convert-pdf-to-word' },
  { title: 'Currency Converter', description: 'Convert between 170+ currencies using real-time exchange rates. Favorite currencies, historical trends, and amount in words.', icon: 'globe-alt', href: '/tools/currency-converter', category: 'converters', blogSlug: 'currency-converter-real-time-exchange-guide' },

  // ===== 开发者工具类 (dev) =====
  { title: 'Unix Timestamp', description: 'Convert Unix timestamps to human-readable dates and vice versa. Live current timestamp and batch conversion support.', icon: 'clock', href: '/tools/unix-timestamp', category: 'dev', blogSlug: 'unix-timestamp-converter-guide' },
  { title: 'JSON Formatter', description: 'Format, minify, and validate JSON with tree view and JSON Path evaluation. Syntax error highlighting with line numbers.', icon: 'code-bracket', href: '/tools/json-formatter', category: 'dev', blogSlug: 'mastering-json-how-to-format-and-minify-your-data' },
  { title: 'JWT Decoder', description: 'Decode JWT tokens and inspect header, payload, and signature. Expiry countdown, claim explanations, and field copying.', icon: 'key', href: '/tools/jwt-decoder', category: 'dev', blogSlug: 'what-is-a-jwt-decode-and-understand-json-web-tokens' },
  { title: 'UUID Generator', description: 'Generate random UUID v4 identifiers. Bulk generation, multiple format options, and version information.', icon: 'finger-print', href: '/tools/uuid-generator', category: 'dev', blogSlug: 'why-use-a-uuid-generator-and-how-it-works' },
  { title: 'Color Converter', description: 'Convert between HEX, RGB, and HSL color formats with live preview. Includes palette generator and contrast checker.', icon: 'paint-brush', href: '/tools/color-converter', category: 'dev', blogSlug: 'a-beginners-guide-to-color-codes-hex-rgb-hsl' },
  { title: 'Code Beautifier', description: 'Format (beautify) or minify HTML, CSS, and JavaScript code. Auto language detection and before/after comparison.', icon: 'sparkles', href: '/tools/code-beautifier', category: 'dev', blogSlug: 'clean-code-happy-life-how-to-beautify-your-html-css-js' },
  { title: 'Password Generator', description: 'Generate strong, random passwords with customizable length and character sets. Includes strength meter and entropy display.', icon: 'shield-check', href: '/tools/password-generator', category: 'dev', blogSlug: 'the-secret-to-a-strong-password-why-and-how-to-generate-one' },
  { title: 'Lorem Ipsum Generator', description: 'Generate Lorem Ipsum placeholder text by paragraphs, sentences, words, or characters. Supports HTML markup output.', icon: 'document-text', href: '/tools/lorem-ipsum-generator', category: 'dev', blogSlug: 'lorem-ipsum-generator-guide' },
  { title: 'QR Code Generator', description: 'Generate QR codes for URLs, text, WiFi credentials, vCards, and more. Customize colors and download as PNG or SVG.', icon: 'qr-code', href: '/tools/qrcode-generator', category: 'dev', blogSlug: 'qr-code-generator-complete-guide' },

  // ===== 图像工具类 (image) =====
  { title: 'Image Compressor', description: 'Compress JPEG, PNG, and WebP images while preserving quality. Batch processing, before/after preview, and size comparison.', icon: 'image-compress', href: '/tools/image-compressor', category: 'image', blogSlug: 'image-compressor-guide-reduce-file-size' },
  { title: 'Image Format Converter', description: 'Convert images between PNG, JPEG, and WebP formats. Batch conversion with adjustable quality and optional resizing.', icon: 'image-refresh', href: '/tools/image-format-converter', category: 'image', blogSlug: 'image-format-converter-guide-png-jpeg-webp' },
  { title: 'Image Cropper & Resizer', description: 'Crop, resize, rotate, and flip images. Preset aspect ratios, social media sizes, and drag-to-crop functionality.', icon: 'crop', href: '/tools/image-crop-resize', category: 'image', blogSlug: 'image-crop-resize-guide-social-media' },
  // { title: 'MP4 to GIF', description: 'Convert MP4 video clips to animated GIFs. Select start/end time, adjust frame rate, and control output dimensions.', icon: 'film', href: '/tools/mp4-to-gif', category: 'image', blogSlug: null },

  // ===== 文本工具类 (text) =====
  { title: 'Case Converter', description: 'Convert text between uppercase, lowercase, title case, sentence case, camelCase, PascalCase, snake_case, and kebab-case.', icon: 'text-size', href: '/tools/case-converter', category: 'text', blogSlug: 'case-converter-guide-text-transformation' },
  { title: 'Encode / Decode', description: 'Encode and decode Base64, URL, HTML entities, Hex, Base32, and ROT13. Auto-detect input type for decoding.', icon: 'eye', href: '/tools/encode-decode', category: 'text', blogSlug: 'encode-decode-guide-base64-url-html' },
  { title: 'Regex Tester', description: 'Test regular expressions with real-time matching, group extraction, and replace mode. Includes common pattern reference library.', icon: 'puzzle', href: '/tools/regex-tester', category: 'text', blogSlug: 'regex-tester-guide-regular-expressions' },
  { title: 'Remove Duplicates', description: 'Remove duplicate lines, empty lines, and trim whitespace. Case-sensitive option and result statistics.', icon: 'funnel', href: '/tools/remove-duplicates', category: 'text', blogSlug: 'remove-duplicate-lines-text-cleaner' },
  { title: 'Sort & Shuffle', description: 'Sort lines alphabetically (A-Z or Z-A), numerically, or randomly shuffle. Remove empty lines before sorting option.', icon: 'bars-arrow-down', href: '/tools/sort-shuffle', category: 'text', blogSlug: 'sort-shuffle-lines-text-tool' },
  { title: 'Text Analyzer', description: 'Count words, characters, sentences, and paragraphs. Includes readability scores, keyword density, and reading time estimation.', icon: 'magnifying-glass-chart', href: '/tools/text-analyzer', category: 'text', blogSlug: 'text-analyzer-guide-word-count-readability' },
];

// ===== 工具查询辅助函数 =====

// 按分类筛选工具
export function getToolsByCategory(category) {
  return allTools.filter(t => t.category === category);
}

// 按 href 查找单个工具
export function getToolByHref(href) {
  return allTools.find(t => t.href === href);
}

// 按 slug 查找工具
export function getToolBySlug(slug) {
  return allTools.find(t => t.href === `/tools/${slug}`);
}

// 获取首页精选工具（按市场需求排序的前 6 个）
export function getFeaturedTools() {
  const featuredSlugs = [
    '/tools/pdf-converter',
    '/tools/password-generator',
    '/tools/qrcode-generator',
    '/tools/image-compressor',
    '/tools/currency-converter',
    '/tools/bmi',
  ];
  return featuredSlugs
    .map(href => allTools.find(t => t.href === href))
    .filter(Boolean);
}

// 获取所有分类
export function getCategories() {
  const categories = [
    { key: 'calculators', name: 'Calculators', description: 'Health, finance, date, and math calculators for everyday use.', icon: 'calculator' },
    { key: 'converters', name: 'Converters', description: 'File, currency, and unit conversion tools for all your needs.', icon: 'arrows-right-left' },
    { key: 'dev', name: 'Developer Tools', description: 'JSON, JWT, UUID, regex, and code formatters for developers.', icon: 'code-bracket' },
    { key: 'image', name: 'Image Tools', description: 'Compress, convert, crop, and resize images right in your browser.', icon: 'image' },
    { key: 'text', name: 'Text Tools', description: 'Case converter, encoder, text stats, sorting, and duplicate removal.', icon: 'text-size' },
  ];
  return categories;
}
