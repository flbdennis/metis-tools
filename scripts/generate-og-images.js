// OG 图片生成脚本 —— 为每个工具页和首页生成专属 OG 图片
// 运行：node scripts/generate-og-images.js
import sharp from 'sharp';
import { mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ogDir = join(__dirname, '..', 'public', 'og');

// 所有工具列表
const tools = [
  { slug: 'bmi', title: 'BMI Calculator' },
  { slug: 'age', title: 'Age Calculator' },
  { slug: 'tip', title: 'Tip Calculator' },
  { slug: 'cm-to-inches', title: 'CM to Inches' },
  { slug: 'lbs-to-kg', title: 'lbs to kg' },
  { slug: 'loan-calculator', title: 'Loan Calculator' },
  { slug: 'unit-converter', title: 'Unit Converter' },
  { slug: 'percentage-calculator', title: 'Percentage Calculator' },
  { slug: 'date-difference', title: 'Date Difference' },
  { slug: 'pdf-converter', title: 'PDF Converter' },
  { slug: 'currency-converter', title: 'Currency Converter' },
  { slug: 'unix-timestamp', title: 'Unix Timestamp' },
  { slug: 'json-formatter', title: 'JSON Formatter' },
  { slug: 'jwt-decoder', title: 'JWT Decoder' },
  { slug: 'uuid-generator', title: 'UUID Generator' },
  { slug: 'color-converter', title: 'Color Converter' },
  { slug: 'code-beautifier', title: 'Code Beautifier' },
  { slug: 'password-generator', title: 'Password Generator' },
  { slug: 'lorem-ipsum-generator', title: 'Lorem Ipsum Generator' },
  { slug: 'qrcode-generator', title: 'QR Code Generator' },
  { slug: 'image-compressor', title: 'Image Compressor' },
  { slug: 'image-format-converter', title: 'Image Format Converter' },
  { slug: 'image-crop-resize', title: 'Image Cropper' },
  { slug: 'mp4-to-gif', title: 'MP4 to GIF' },
  { slug: 'case-converter', title: 'Case Converter' },
  { slug: 'encode-decode', title: 'Encode / Decode' },
  { slug: 'regex-tester', title: 'Regex Tester' },
  { slug: 'remove-duplicates', title: 'Remove Duplicates' },
  { slug: 'sort-shuffle', title: 'Sort & Shuffle' },
  { slug: 'text-analyzer', title: 'Text Analyzer' },
];

// 生成 SVG overlay 文本 → 转 PNG
async function generateOGImage(title, subtitle, filename) {
  const width = 1200;
  const height = 630;

  // 转义 XML 特殊字符
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  // 构建 SVG（渐变色背景 + 白色文字）
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#4338ca;stop-opacity:1" />
        <stop offset="50%" style="stop-color:#4f46e5;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#312e81;stop-opacity:1" />
      </linearGradient>
    </defs>
    <!-- 背景 -->
    <rect width="${width}" height="${height}" fill="url(#bg)" />
    <!-- 装饰圆 -->
    <circle cx="100" cy="530" r="200" fill="rgba(255,255,255,0.05)" />
    <circle cx="1100" cy="100" r="150" fill="rgba(255,255,255,0.05)" />
    <!-- 标题 -->
    <text x="600" y="280" font-family="Inter, system-ui, sans-serif" font-size="52" font-weight="bold" fill="white" text-anchor="middle" letter-spacing="-0.5">
      ${esc(title)}
    </text>
    <!-- 副标题 -->
    <text x="600" y="340" font-family="Inter, system-ui, sans-serif" font-size="24" fill="rgba(255,255,255,0.7)" text-anchor="middle">
      ${esc(subtitle)}
    </text>
    <!-- 底部品牌 -->
    <text x="600" y="500" font-family="Inter, system-ui, sans-serif" font-size="20" fill="rgba(255,255,255,0.5)" text-anchor="middle">
      MetisTools — Free Online Tools
    </text>
    <!-- 底部装饰线 -->
    <line x1="450" y1="520" x2="750" y2="520" stroke="rgba(255,255,255,0.15)" stroke-width="1" />
  </svg>`;

  return sharp(Buffer.from(svg))
    .jpeg({ quality: 82, progressive: true })
    .toFile(join(ogDir, filename.replace('.png', '.jpg')));
}

// 主逻辑
async function main() {
  // 确保目录存在
  if (!existsSync(ogDir)) {
    mkdirSync(ogDir, { recursive: true });
  }

  console.log(`Generating ${tools.length + 1} OG images...`);

  // 首页 OG 图片
  await generateOGImage(
    'MetisTools',
    'Free Online Converters, Calculators & Developer Tools',
    'home.png'
  );
  console.log('  ✓ home.png');

  // 工具页 OG 图片
  for (const tool of tools) {
    await generateOGImage(
      tool.title,
      'Free Online Tool — No Signup Required',
      `${tool.slug}.png`
    );
    console.log(`  ✓ ${tool.slug}.png`);
  }

  console.log('Done! All OG images generated.');
}

main().catch(console.error);
