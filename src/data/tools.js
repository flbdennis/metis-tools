// src/data/tools.js
// 所有工具的元数据列表
export const allTools = [
  // 文件转换类 (converters)
  { title: "PDF Converter", description: "Convert PDF to image, text, HTML, and more", icon: "🔄", href: "/tools/pdf-converter", category: "converters" },
  { title: "Currency Converter", description: "Real-time exchange rates", icon: "💱", href: "/tools/currency-converter", category: "converters" },
  // 计算器类 (calculators)
  { title: "BMI Calculator", description: "Body Mass Index for adults", icon: "⚖️", href: "/tools/bmi", category: "calculators" },
  { title: "Age Calculator", description: "Exact age in years, months, days", icon: "🎂", href: "/tools/age", category: "calculators" },
  { title: "Tip Calculator", description: "Split bill with tip", icon: "💵", href: "/tools/tip", category: "calculators" },
  { title: "CM to Inches", description: "Length conversion", icon: "📐", href: "/tools/cm-to-inches", category: "calculators" },
  { title: "lbs to kg", description: "Weight conversion", icon: "⚖️", href: "/tools/lbs-to-kg", category: "calculators" },
  { title: "Loan Calculator", description: "Monthly payment & interest", icon: "🏦", href: "/tools/loan-calculator", category: "calculators" },
  { title: "Unit Converter", description: "Length, weight, temperature, volume", icon: "📏", href: "/tools/unit-converter", category: "calculators" },
  { title: "Percentage Calculator", description: "Find percentages, percent of, change", icon: "📊", href: "/tools/percentage-calculator", category: "calculators" },
  { title: "Date Difference", description: "Days between dates", icon: "📅", href: "/tools/date-difference", category: "calculators" },
  // 开发者工具 (dev-tools)
  { title: "Unix Timestamp Converter", description: "Convert between Unix timestamps and human-readable dates", icon: "⏱️", href: "/tools/unix-timestamp", category: "dev" },
  { title: "JSON Formatter & Minifier", description: "Format or minify JSON code", icon: "🔧", href: "/tools/json-formatter", category: "dev" },
  { title: "JWT Decoder", description: "Decode JSON Web Tokens", icon: "🔓", href: "/tools/jwt-decoder", category: "dev" },
  { title: "UUID / GUID Generator", description: "Generate random UUID v4", icon: "🆔", href: "/tools/uuid-generator", category: "dev" },
  { title: "Color Converter", description: "Convert HEX, RGB, HSL", icon: "🎨", href: "/tools/color-converter", category: "dev" },
  { title: "Code Beautifier", description: "Beautify or minify HTML, CSS, JS", icon: "✨", href: "/tools/code-beautifier", category: "dev" },
  { title: "Random Password Generator", description: "Generate strong passwords", icon: "🔐", href: "/tools/password-generator", category: "dev" },
  { title: "Lorem Ipsum Generator", description: "Create dummy text", icon: "📝", href: "/tools/lorem-ipsum-generator", category: "dev" },
  { title: "QR Code Generator", description: "Create QR codes", icon: "📱", href: "/tools/qrcode-generator", category: "dev" },
  // 图像工具 (image-tools)
  { title: "Image Compressor", description: "Reduce image file size", icon: "🖼️", href: "/tools/image-compressor", category: "image" },
  { title: "Image Format Converter", description: "Convert PNG, JPEG, WebP", icon: "🔄", href: "/tools/image-format-converter", category: "image" },
  { title: "Image Cropper & Resizer", description: "Crop or resize images", icon: "✂️", href: "/tools/image-crop-resize", category: "image" },
  // 文本工具 (text-tools)
  { title: "Case Converter", description: "Convert text to different cases", icon: "🔠", href: "/tools/case-converter", category: "text" },
  { title: "Encode / Decode", description: "Base64, URL, HTML encoding/decoding", icon: "🔐", href: "/tools/encode-decode", category: "text" },
  { title: "Regex Tester", description: "Test regular expressions", icon: "🎯", href: "/tools/regex-tester", category: "text" },
  { title: "Remove Duplicate Lines", description: "Remove duplicate lines", icon: "🧹", href: "/tools/remove-duplicates", category: "text" },
  { title: "Text Statistics", description: "Word, character, line counter", icon: "📊", href: "/tools/text-stats", category: "text" },
];