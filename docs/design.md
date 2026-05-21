# MetisTools 重建设计文档

## 一、项目概述

### 1.1 目标
重新开发 metistools.com，升级 UI/UX、完善工具功能、优化 SEO、支持广告变现。技术栈：Astro 4 + Flowbite + Tailwind CSS + ts

### 1.2 复用的代码
| 文件 | 用途 |
|------|------|
| `public/Ads.txt` | Google Ads 授权 |
| `public/google12a4140ea0c83294.html` | Google Search Console 验证 |
| `public/favicon.ico` | 网站图标 |
| `public/logo.webp` | 网站 Logo |
| `public/og-default.png` | Open Graph 默认图片 |
| `public/js/common.js` | 公共 JS（暗色模式等，评估后可能部分复用） |
| Google Analytics ID: `G-87VGYW1H47` | GA4 |
| Google AdSense: `ca-pub-3912115209665374` | AdSense |
| `src/data/seo.js` | SEO 元数据（需要更新） |
| `src/lib/text-tools.js` | 文本工具纯函数（复用） |
| `src/lib/pdf-tools.js` | PDF 工具函数（复用） |
| `src/content/blog/` | 15 篇现有博客文章 |
| `generate-sitemap.js` | 站点地图生成（可能需要更新） |

---

## 二、技术架构

### 2.1 技术栈
- **框架**: Astro 4.x
- **CSS**: Tailwind CSS 3.x
- **UI 组件**: Flowbite + flowbite-astro
- **图标**: Flowbite Icons（内置于 Flowbite）
- **语言**: ts
- **部署**: Cloudflare Pages（静态输出）

### 2.2 目录结构
```
src/
├── api/
│   └── client.js          # API 调用层（统一 fetch 封装，预留自研 API 切换）
├── components/
│   ├── ui/                 # 通用 UI 组件
│   │   ├── Button.astro
│   │   ├── Input.astro
│   │   ├── Select.astro
│   │   ├── Toast.astro
│   │   ├── Modal.astro
│   │   ├── Tabs.astro
│   │   ├── ToolCard.astro
│   │   └── AdPlaceholder.astro  # 广告位占位组件
│   ├── layout/             # 布局组件
│   │   ├── BaseLayout.astro
│   │   ├── ToolLayout.astro    # 工具页统一布局
│   │   ├── BlogLayout.astro
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── Breadcrumb.astro
│   │   └── Sidebar.astro       # 工具页侧边栏
│   ├── seo/
│   │   ├── SeoHead.astro       # SEO meta 标签
│   │   ├── Schema.astro        # JSON-LD 结构化数据
│   │   └── SocialShare.astro   # 社交分享按钮
│   └── tool/               # 工具专用组件
│       ├── ResultDisplay.astro # 结果展示区
│       └── ToolDescription.astro # 工具说明区（含 blog 链接）
├── content/
│   └── blog/               # 博客文章（.md）
├── data/
│   ├── site.js             # 站点全局配置（域名、名称、邮箱、社交链接等）
│   ├── tools.js            # 工具元数据配置
│   ├── seo.js              # 全站 SEO 元数据（首页、分类页、工具页、Blog、Support）
│   └── navigation.js       # 导航菜单配置
├── layouts/
│   └── BaseLayout.astro    # 根布局
├── lib/                    # 工具逻辑库（纯函数）
│   ├── text-tools.js       # 文本工具
│   ├── pdf-tools.js        # PDF 工具
│   ├── calc-tools.js       # 计算工具
│   ├── dev-tools.js        # 开发者工具
│   ├── image-tools.js      # 图像工具
│   └── convert-tools.js    # 转换工具
├── pages/
│   ├── index.astro         # 首页
│   ├── calculators.astro   # 计算器分类页
│   ├── converters.astro    # 转换器分类页
│   ├── dev-tools.astro     # 开发工具分类页
│   ├── image-tools.astro   # 图像工具分类页
│   ├── text-tools.astro    # 文本工具分类页
│   ├── blog/
│   │   ├── index.astro     # 博客列表
│   │   └── [...slug].astro # 博客详情
│   ├── support/
│   │   ├── about.astro
│   │   ├── contact.astro
│   │   ├── faq.astro
│   │   ├── privacy-policy.astro
│   │   └── terms.astro
│   ├── tools/              # 工具页面
│   │   ├── bmi.astro
│   │   ├── age.astro
│   │   ├── ...             # 共 29 个工具页面
│   │   └── text-analyzer.astro
│   ├── robots.txt.js
│   └── sitemap.astro
├── styles/
│   └── global.css          # 全局样式
└── utils/
    ├── validation.js       # 表单验证工具集
    └── format.js           # 格式化工具函数
```

---

## 2.3 统一配置管理体系

### 2.3.1 设计原则
所有公用字符串集中管理，禁止在页面/组件中硬编码。分为三个层级：

| 层级 | 文件 | 管理内容 | 使用者 |
|------|------|---------|--------|
| **全局站点** | `data/site.js` | 域名、站名、邮箱、组织、社交链接、GA/AdSense ID | 所有页面/组件 |
| **SEO 文本** | `data/seo.js` | 每个页面的 title/description/og/结构化数据 | 所有页面 |
| **导航配置** | `data/navigation.js` | 菜单项、分类路由、页脚链接 | Header/Footer/Breadcrumb |
| **工具元数据** | `data/tools.js` | 工具名、描述、图标、分类、路由、关联 blog | 首页/分类页/工具页 |

### 2.3.2 `data/site.js` 结构
```js
// 站点全局配置 —— 所有公用字符串的唯一来源
export const siteConfig = {
  // 基础信息
  name: 'MetisTools',
  tagline: 'Free Online Tools — No Signup Required',
  url: 'https://metistools.com',
  email: 'flbdennis.fan@gmail.com',
  orgName: 'MetisTools',
  // 社交媒体
  social: {
    twitter: 'https://twitter.com/metistools',
    facebook: 'https://facebook.com/metistools',
    linkedin: 'https://linkedin.com/company/metistools',
    reddit: 'https://reddit.com/r/metistools',
    pinterest: 'https://pinterest.com/metistools',
  },
  // 第三方 ID
  googleAnalyticsId: 'G-87VGYW1H47',
  googleAdsenseId: 'ca-pub-3912115209665374',
  // 联系方式
  contact: {
    email: 'flbdennis.fan@gmail.com',
    responseTime: '24-48 hours',
  },
  // 版权
  copyright: `© ${new Date().getFullYear()} MetisTools. All rights reserved.`,
};
```

### 2.3.3 `data/seo.js` 扩展结构
```js
// 全站 SEO 元数据 —— 按页面路径统一管理
export const seoData = {
  // 首页
  home: {
    title: '...',
    description: '...',
  },
  // 分类页
  categories: {
    calculators: { title: '...', description: '...' },
    converters: { title: '...', description: '...' },
    devTools: { title: '...', description: '...' },
    imageTools: { title: '...', description: '...' },
    textTools: { title: '...', description: '...' },
  },
  // 工具页（复用现有结构，扩展补充缺失工具）
  tools: {
    bmi: { title: '...', description: '...' },
    age: { title: '...', description: '...' },
    // ...
  },
  // Blog
  blog: {
    index: { title: '...', description: '...' },
  },
  // Support 页面
  support: {
    about: { title: '...', description: '...' },
    contact: { title: '...', description: '...' },
    faq: { title: '...', description: '...' },
    privacy: { title: '...', description: '...' },
    terms: { title: '...', description: '...' },
  },
};
```

### 2.3.4 举一反三：其他统一管理场景
| 场景 | 管理方式 | 文件 |
|------|---------|------|
| 表单验证错误消息 | 统一错误文案对象 | `utils/validation.js` |
| Toast 通知文案 | 成功/失败/警告统一文案 | `data/messages.js` |
| 分类名称与描述 | 分类元数据 | `data/categories.js` |
| 社交分享默认文案 | 分享配置对象 | `data/social.js` |
| 广告位配置 | 广告位 ID/尺寸/位置 | `data/ads.js` |
| Cookie 弹窗文案 | 同意弹窗所有文案 | `data/cookies.js` |

---

## 三、UI/UX 设计方案

### 3.1 整体风格
- **色彩基调**: 浅灰/白底 + 深色文字，避免纯白刺眼。使用 slate/gray 系中性色
- **主色调**: Indigo-600（专业、信任感）+ Emerald-500（功能完成、成功提示）
- **字体**: Inter（英文地区首选），系统字体栈做 fallback
- **圆角**: 适度圆角（rounded-lg），卡片用 rounded-xl
- **阴影**: 轻阴影（shadow-sm / shadow-md），不过度使用
- **间距**: 宽松、留白充足，符合英文地区阅读习惯

### 3.2 明暗方案
单一明亮模式，背景色使用 `bg-gray-50` 系列，避免 `bg-white` 带来的刺眼感。

### 3.3 响应式断点
- Mobile: < 640px（单列，工具卡片 1 列）
- Tablet: 640-1024px（工具卡片 2 列）
- Desktop: > 1024px（工具卡片 3-4 列，侧边栏可见）

### 3.4 导航结构
- **顶部固定导航**: Logo | 工具分类下拉菜单 | Blog | About | Contact | FAQ
- **移动端**: 汉堡菜单 + 侧滑面板（Flowbite Drawer）
- **面包屑导航**: Home > Category > Tool Name

### 3.5 首页设计
```
┌─────────────────────────────────────┐
│  Hero Section                       │
│  - 标题 + 副标题 + CTA              │
│  - 搜索/查找工具输入框              │
│  [Ad: 横幅 728x90]                  │
├─────────────────────────────────────┤
│  Popular Tools (6 个高需求工具)      │
│  按市场需求排序，带热度标记           │
├─────────────────────────────────────┤
│  Categories Grid (5 个分类卡片)     │
├─────────────────────────────────────┤
│  All Tools Grid (按分类分区展示)    │
│  [Ad: 原生广告 - 工具列表中间]      │
├─────────────────────────────────────┤
│  Recent Blog Posts                  │
│  [Ad: 横幅]                         │
├─────────────────────────────────────┤
│  Footer                             │
└─────────────────────────────────────┘
```

### 3.6 首页精选工具（按市场需求排序）

基于 Google 搜索量和工具类网站竞争度调研，首页 "Popular Tools" 展示以下 6 个最高需求工具：

| 排名 | 工具 | 月搜索量(估) | 需求原因 |
|------|------|-------------|----------|
| 1 | PDF Converter | 极高 | PDF 转换/压缩/合并是工具站流量最大的品类 |
| 2 | Password Generator | 极高 | 网络安全意识提升，个人和企业持续需求 |
| 3 | QR Code Generator | 极高 | 营销、支付、社交场景广泛使用 |
| 4 | Image Compressor | 极高 | SEO 图片优化、社交媒体、存储空间需求 |
| 5 | Currency Converter | 高 | 国际旅行、跨境电商、远程工作增长 |
| 6 | BMI Calculator | 高 | 健康意识提升，健身人群稳定需求 |

### 3.7 工具页面视口优先布局

**核心原则**：用户无需滚动即可看到输入区 + 操作按钮 + 结果区。

桌面端（≥1024px）采用**左右分栏**：
```
┌──────────────────────────────────────────┐
│  Breadcrumb                              │
├──────────────────────────────────────────┤
│  工具标题 + 描述（1行）                    │
│  [Ad: 横幅]                              │
├────────────────────┬─────────────────────┤
│  输入区             │  结果区              │
│  (表单/上传/配置)   │  (实时/点击后展示)    │
│                    │                     │
│  [操作按钮]         │  [复制/下载按钮]     │
│                    │                     │
└────────────────────┴─────────────────────┘
│  工具说明文本 + Blog 链接                  │
└──────────────────────────────────────────┘
```

移动端（<1024px）采用**紧凑上下布局**，输入区和结果区间距压缩，确保在常见屏幕（≥375px 高度）下首屏可见。

### 3.8 工具图标唯一性规范

所有工具使用 Flowbite 内置 SVG 图标，不允许 emoji，确保 29 个工具图标不重复。

---

## 四、工具规格详细说明

### 4.1 计算器类 (Calculators)

| 工具 | 图标 (Flowbite) | icon 名 |
|------|----------------|---------|
| BMI Calculator | 体重秤 | `balance-scale` |
| Age Calculator | 日历+时钟 | `calendar-clock` |
| Tip Calculator | 货币纸币 | `currency-dollar` |
| CM to Inches | 双向箭头 | `arrows-right-left` |
| lbs to kg | 磅秤 | `scale-balanced` |
| Loan Calculator | 银行大楼 | `building-library` |
| Unit Converter | 调节滑块 | `adjustments-horizontal` |
| Percentage Calculator | 饼图 | `chart-pie` |
| Date Difference | 日历 | `calendar-days` |

#### 4.1.1 BMI Calculator (`/tools/bmi`)
**现有功能**: 输入身高(cm)体重(kg)，计算 BMI 值和分类
**扩展功能**:
- 公制/英制单位切换（cm/kg ↔ ft+in/lbs）
- BMI 可视化刻度尺（颜色分区：偏瘦/正常/超重/肥胖）
- 健康体重范围建议
- 体脂率估算（可选输入年龄、性别）
- BMI Prime 值
**表单验证**: 身高范围 50-300cm，体重 20-500kg，输入限制正数+1位小数
**关联 Blog**: （待新建）

#### 4.1.2 Age Calculator (`/tools/age`)
**现有功能**: 输入出生日期，计算年龄（年/月/日），总天数
**扩展功能**:
- 倒计时到下次生日（天/时/分）
- 年龄按不同单位展示（月、周、天、小时、分钟）
- 出生日是星期几
- 星座判断
- 有趣统计（呼吸次数、心跳次数估算）
- 分享生日结果
**表单验证**: 日期不能为未来，不能早于 1900-01-01
**关联 Blog**: `age-calculator-more-than-just-a-birthday-countdown.md`（保留）

#### 4.1.3 Tip Calculator (`/tools/tip`)
**现有功能**: 账单金额、小费比例、人数、计算小费和人均
**扩展功能**:
- 服务满意度预设按钮（15%/18%/20%/22%/自定义）
- 向上取整选项
- 含税/不含税切换
- 分割账单详情表（每人应付明细）
- 历史记录（localStorage）
**表单验证**: 金额正数+2位小数，人数正整数 1-100，比例 0-100
**关联 Blog**: `the-ultimate-guide-to-using-a-tip-calculator.md`（保留）

#### 4.1.4 CM to Inches (`/tools/cm-to-inches`)
**现有功能**: cm ↔ inches 单向转换
**扩展功能**:
- 双向转换（实时联动）
- 英尺+英寸格式输出（如 175cm = 5'9"）
- 常用长度转换参考表
- 批量转换模式
**表单验证**: 正数，最多 2 位小数
**关联 Blog**: `unit-converter-101-how-to-convert-like-a-pro.md`（保留）

#### 4.1.5 lbs to kg (`/tools/lbs-to-kg`)
**现有功能**: lbs → kg 单向转换
**扩展功能**:
- 双向转换
- 英石+磅格式（如 180lbs = 12st 12lbs）
- 常用重量参考表
**表单验证**: 正数，最多 2 位小数
**关联 Blog**: `unit-converter-101-how-to-convert-like-a-pro.md`（共用）

#### 4.1.6 Loan Calculator (`/tools/loan-calculator`)
**现有功能**: 本金、利率、期限，计算月供和总利息
**扩展功能**:
- 还款计划表（amortization schedule）- 按月明细
- Pie Chart 展示本金 vs 利息比例
- 额外还款计算（每月多还 X，可省多少利息）
- 两种还款方式：等额本息/等额本金
- 可承受贷款金额反算（给定月供，算最大贷款额）
**表单验证**: 金额正数，利率 0-100，期限 1-50 年
**关联 Blog**: （待新建）

#### 4.1.7 Unit Converter (`/tools/unit-converter`)
**现有功能**: 长度、重量、温度、体积
**扩展功能**:
- 新增分类：面积、速度、数据存储（KB/MB/GB/TB）、时间、压力、能量、功率、角度
- 收藏常用单位组合
- 最近使用记录（localStorage）
- 快速换算（输入一个值，所有单位同时显示结果）
**表单验证**: 正数
**关联 Blog**: `unit-converter-101-how-to-convert-like-a-pro.md`（保留）

#### 4.1.8 Percentage Calculator (`/tools/percentage-calculator`)
**现有功能**: 基础百分比
**扩展功能**:
- 多模式 Tabs 切换：
  1. X 的 Y% 是多少
  2. X 是 Y 的百分之几
  3. 百分比变化（从 A 到 B）
  4. 百分比增加/减少
- 结果视觉化进度条
- 一键复制公式和结果
**表单验证**: 数字输入，正数+负数
**关联 Blog**: （待新建）

#### 4.1.9 Date Difference (`/tools/date-difference`)
**现有功能**: 两个日期之间的天数
**扩展功能**:
- 显示年/月/周/天 组合
- 仅计算工作日（排除周末）
- 自定义排除节假日（可选）
- 加上/减去 X 天的日期计算模式
- 日期范围生成器（生成起始→结束的每一天）
**表单验证**: 起始日期 ≤ 结束日期
**关联 Blog**: （待新建）

---

### 4.2 转换器类 (Converters)

| 工具 | 图标 (Flowbite) | icon 名 |
|------|----------------|---------|
| PDF Converter | 文档+向下箭头 | `document-arrow-down` |
| Currency Converter | 环球 | `globe-alt` |

#### 4.2.1 PDF Converter (`/tools/pdf-converter`)
**现有功能**: PDF → 图片/文本/HTML
**扩展功能**:
- PDF 压缩（质量调节）
- PDF 合并（多文件 → 单文件）
- PDF 页面提取/删除/旋转
- 拖拽上传区
- 转换历史记录
**输入安全**: 文件类型验证、大小限制 50MB
**关联 Blog**: `how-to-convert-pdf-to-word.md`（保留）

#### 4.2.2 Currency Converter (`/tools/currency-converter`)
**现有功能**: 实时汇率转换
**扩展功能**:
- 金额 → 大写英文（如 123.45 → "One hundred twenty-three and 45/100"）
- 常用货币收藏
- 汇率趋势图表（使用免费 API 的历史数据）
- 反向换算快速切换
**表单验证**: 正数，最多 2 位小数，输入时限制
**API 层**: 使用 `src/api/client.js` 统一调用
**关联 Blog**: （待新建）

---

### 4.3 开发者工具类 (Dev Tools)

| 工具 | 图标 (Flowbite) | icon 名 |
|------|----------------|---------|
| Unix Timestamp | 时钟 | `clock` |
| JSON Formatter | 代码括号 | `code-bracket` |
| JWT Decoder | 钥匙 | `key` |
| UUID Generator | 指纹 | `finger-print` |
| Color Converter | 颜料刷 | `paint-brush` |
| Code Beautifier | 闪亮 | `sparkles` |
| Password Generator | 盾牌勾选 | `shield-check` |
| Lorem Ipsum Generator | 文档文本 | `document-text` |
| QR Code Generator | 二维码 | `qr-code` |

#### 4.3.1 Unix Timestamp (`/tools/unix-timestamp`)
**现有功能**: timestamp ↔ 日期 互转
**扩展功能**:
- 实时当前时间戳（秒级更新）
- 批量转换（多行输入）
- 日期选择器快捷输入
- 常用时区时间对照
**关联 Blog**: （待新建）

#### 4.3.2 JSON Formatter (`/tools/json-formatter`)
**现有功能**: 格式化/压缩 JSON
**扩展功能**:
- 树形视图（可折叠/展开节点）
- 语法错误行号提示
- JSON Path 评估模式
- 缩进空格数配置（2/4/tab）
- 一键复制/下载
**关联 Blog**: `mastering-json-how-to-format-and-minify-your-data.md`（保留）

#### 4.3.3 JWT Decoder (`/tools/jwt-decoder`)
**现有功能**: 解码 JWT 三部分
**扩展功能**:
- 过期倒计时（如果 token 未过期）
- 已过期红色警告
- Payload 字段逐个说明（iat、exp、sub 等标准字段含义）
- 一键复制任一字段
**关联 Blog**: `what-is-a-jwt-decode-and-understand-json-web-tokens.md`（保留）

#### 4.3.4 UUID Generator (`/tools/uuid-generator`)
**现有功能**: 生成 UUID v4
**扩展功能**:
- 批量生成（1-100 个）
- 大写/小写/无连字符格式
- UUID 版本说明
- 一键复制/下载
**关联 Blog**: `why-use-a-uuid-generator-and-how-it-works.md`（保留）

#### 4.3.5 Color Converter (`/tools/color-converter`)
**现有功能**: HEX/RGB/HSL 互转
**扩展功能**:
- 内置颜色选择器（原生 input[type=color]）
- 实时预览色块
- 色彩对比度检测（WCAG AA/AAA）
- 调色板生成（互补色、类似色、三色）
- 复制颜色值
**表单验证**: HEX 格式验证（3/4/6/8位），RGB 0-255，HSL 值域
**关联 Blog**: `a-beginners-guide-to-color-codes-hex-rgb-hsl.md`（保留）

#### 4.3.6 Code Beautifier (`/tools/code-beautifier`)
**现有功能**: HTML/CSS/JS 格式化/压缩
**扩展功能**:
- 自动检测语言类型
- 缩进大小配置
- Before/After 字符数对比
- 一键复制/下载文件
**关联 Blog**: `clean-code-happy-life-how-to-beautify-your-html-css-js.md`（保留）

#### 4.3.7 Password Generator (`/tools/password-generator`)
**现有功能**: 生成随机密码
**扩展功能**:
- 密码强度实时指示器（弱/中/强/极强）
- 信息熵显示（bits）
- 易记密码模式（passphrase: 单词+数字+符号）
- 避免混淆字符选项（i/l/1/o/0）
- 批量生成 + 下载
- 密码泄露检测提示（Have I Been Pwned API，可选）
**关联 Blog**: `the-secret-to-a-strong-password-why-and-how-to-generate-one.md`（保留）

#### 4.3.8 Lorem Ipsum Generator (`/tools/lorem-ipsum-generator`)
**扩展功能**:
- 按段落/句子/单词/字符数生成
- HTML 富文本格式（带 p/h1/ul 标签）
- 自定义起始文本（Lorem ipsum 或自定义）
- 一键复制
**关联 Blog**: （待新建）

#### 4.3.9 QR Code Generator (`/tools/qrcode-generator`)
**现有功能**: 文本/URL → QR PNG
**扩展功能**:
- 内容类型预设：URL/文本/Email/电话/SMS/WiFi/vCard
- WiFi 二维码（SSID + 密码 + 加密方式）
- 颜色自定义（前景色/背景色）
- 尺寸选择
- 下载 PNG / SVG
**关联 Blog**: （待新建）

---

### 4.4 图像工具类 (Image Tools)

| 工具 | 图标 (Flowbite) | icon 名 |
|------|----------------|---------|
| Image Compressor | 图片+压缩 | `image-compress` |
| Image Format Converter | 图片+箭头循环 | `image-refresh` |
| Image Cropper & Resizer | 裁剪框 | `crop` |
| MP4 to GIF | 胶片 | `film` |

#### 4.4.1 Image Compressor (`/tools/image-compressor`)
**现有功能**: 压缩 JPEG/PNG/WebP
**扩展功能**:
- 拖拽上传区
- Before/After 预览对比
- 质量滑块（0-100）
- 压缩后文件大小、节省百分比显示
- 批量压缩（多图 + 下载 ZIP）
- 预设质量（高/中/低/自定义）
**输入安全**: 文件类型白名单，大小限制 100MB
**关联 Blog**: （待新建）

#### 4.4.2 Image Format Converter (`/tools/image-format-converter`)
**现有功能**: PNG ↔ JPEG ↔ WebP
**扩展功能**:
- 输出质量调节
- 批量转换 + 下载 ZIP
- 可选同时调整尺寸
- 透明背景处理选项
**输入安全**: 文件类型白名单
**关联 Blog**: （待新建）

#### 4.4.3 Image Cropper & Resizer (`/tools/image-crop-resize`)
**现有功能**: 裁剪/缩放
**扩展功能**:
- 预设裁剪比例按钮（原始/1:1/4:3/16:9/3:2/自定义）
- 社交媒体尺寸预设（Instagram 1080x1080, Twitter 1200x675 等）
- 旋转/翻转
- 输出格式选择
**关联 Blog**: （待新建）

#### 4.4.4 MP4 to GIF Converter (`/tools/mp4-to-gif`)
**现有功能**: MP4 → GIF
**扩展功能**:
- 起止时间选择（截取片段）
- 帧率/FPS 调节
- 输出尺寸调节
- 预览生成结果
**输入安全**: 文件类型 mp4，大小限制 100MB
**关联 Blog**: （待新建）

---

### 4.5 文本工具类 (Text Tools)

| 工具 | 图标 (Flowbite) | icon 名 |
|------|----------------|---------|
| Case Converter | 字母大小写 | `text-size` |
| Encode / Decode | 眼睛 | `eye` |
| Regex Tester | 拼图 | `puzzle` |
| Remove Duplicates | 过滤 | `funnel` |
| Sort & Shuffle | 排序箭头 | `bars-arrow-down` |
| Text Analyzer | 放大镜+图表 | `magnifying-glass-chart` |

#### 4.5.1 Case Converter (`/tools/case-converter`)
**现有功能**: 大小写 + 命名风格
**扩展功能**:
- 上下颜色预览（各风格效果实时卡片展示）
- 一键复制、一键下载
- 字符数变化对比（转换前后）
**关联 Blog**: （待新建）

#### 4.5.2 Encode / Decode (`/tools/encode-decode`)
**现有功能**: Base64 / URL / HTML
**扩展功能**:
- 新增：Hex 编解码、Base32、ROT13
- 双向：编码和解码都在同一页面，按需切换
- 自动检测输入类型
**关联 Blog**: （待新建）

#### 4.5.3 Regex Tester (`/tools/regex-tester`)
**现有功能**: 正则匹配测试
**扩展功能**:
- 匹配结果高亮 + 分组详情
- 替换模式（Find & Replace）
- 常用正则速查面板（Email/URL/IP/手机号等）
- Flags 复选框（g/i/m/s/u）
- 匹配数量统计
**关联 Blog**: （待新建）

#### 4.5.4 Remove Duplicate Lines (`/tools/remove-duplicates`)
**扩展功能**:
- 大小写敏感选项
- 去除空行
- 修剪首尾空格
- 结果统计（移除 X 行，保留 Y 行）
- 排序输出选项
**关联 Blog**: （待新建）

#### 4.5.5 Sort & Shuffle Lines (`/tools/sort-shuffle`)
**扩展功能**:
- A-Z / Z-A / 数字排序 / 随机打乱
- 升序/降序
- 移除空行先行
- 行数统计
**关联 Blog**: （待新建）

#### 4.5.6 Text Analyzer (`/tools/text-analyzer`)  ← 合并 text-statistics + text-stats
**现有功能**: 字数/字符/行数统计
**扩展功能**:
- 单词数、字符数（含空格/不含空格）
- 句子数、段落数
- 可读性评分（Flesch Reading Ease、Flesch-Kincaid Grade Level）
- 关键词密度分析（Top 10 高频词）
- 阅读时间、朗读时间估算
- 音节数统计
- 最长/最短单词
**关联 Blog**: （待新建）

---

### 4.6 MP4 to GIF Converter (`/tools/mp4-to-gif`)
（归入图像工具类）
**关联 Blog**: （待新建）

---

## 五、广告位布局策略

### 5.1 广告位总览
| 位置 | 类型 | 页面 |
|------|------|------|
| 首页 Hero 下方 | 横幅 728x90 / 响应式 | 首页 |
| 工具列表中部 | 原生/Feed | 分类页 |
| 工具操作区上方 | 横幅 | 工具页 |
| 工具结果区下方 | 横幅 | 工具页 |
| 侧边栏 | 矩形 300x250 | 工具页 |
| 博客文章中部 | 原生 | Blog |
| 博客底部 | 横幅 | Blog |
| 页脚上方 | 横幅 | 全站 |

### 5.2 广告原则
- 每个页面最多 3 个广告位
- 广告位用 `<AdPlaceholder />` 组件包裹，方便 Ads 审批通过后快速替换
- 广告不影响核心工具操作流
- 移动端不展示侧边栏广告

---

## 六、SEO 策略

### 6.1 技术 SEO
- 每个页面独立 `<title>` + `<meta description>`
- Canonical URL
- Open Graph + Twitter Card 完整标签
- JSON-LD 结构化数据（WebSite、BreadcrumbList、HowTo、Article）
- `robots.txt` 和 XML Sitemap 自动生成
- 面包屑导航（结构化数据标记）
- 所有图片 alt 文本
- 移动端友好（响应式）

### 6.2 内容 SEO
- 工具页面底部 200+ 字功能说明（含目标关键词）
- 每个工具页面链接到相关 Blog（提升内链）
- Blog 文章内链到对应工具页
- FAQ 页面包含结构化 HowTo/FAQ Schema

### 6.3 社交分享按钮（SEO 间接信号）
- Facebook
- X (Twitter)
- LinkedIn
- Reddit
- Pinterest
- WhatsApp（仅移动端显示）
- 使用 Web Share API（移动端原生分享面板优先）

---

## 七、表单验证体系

### 7.1 验证层级
1. **输入时验证** (input event)：限制字符类型、小数位数、数值范围
2. **失焦验证** (blur event)：格式校验
3. **提交验证** (submit event)：完整业务逻辑校验
4. **文件验证** (change event)：类型、大小

### 7.2 工具模块 `src/utils/validation.js`
```
- isPositiveNumber(val)          # 正数
- isPositiveInteger(val)         # 正整数
- isInRange(val, min, max)       # 数值范围
- isValidEmail(val)              # 邮箱格式
- isValidUrl(val)                # URL 格式
- isValidHex(val)                # HEX 颜色
- isValidDate(val)               # 日期格式
- isFileType(file, types[])      # 文件类型
- isFileSize(file, maxBytes)     # 文件大小
- limitDecimalPlaces(val, n)     # 限制小数位数
- restrictInput(el, pattern)     # 实时输入限制（绑定事件）
```

### 7.3 Flowbite 集成
- Input 组件的 `helper-text` 用于错误提示
- 验证失败时 Input 添加红色边框 + 错误图标
- 验证通过时 Input 添加绿色边框 + 成功图标

---

## 八、API 调用层设计

### 8.1 `src/api/client.js` 设计
```js
// 统一 API 调用客户端
// 当前所有工具为纯前端实现，仅 Currency Converter 使用第三方汇率 API
// 未来切换到自研 API 时，只需修改 BASE_URL 和请求头

const API_BASE_URL = ''; // 预留：自研 API 地址
const EXCHANGE_API_URL = 'https://api.exchangerate-api.com/v4/latest/';

export async function apiFetch(endpoint, options = {}) {
  // 统一请求封装：错误处理、超时、重试
}

export async function fetchExchangeRates(baseCurrency = 'USD') {
  // 汇率 API 调用
}
```

### 8.2 未来 API 扩展点
- PDF 高级操作（Word/Excel 转换） → 需要服务端
- AI 功能（文本摘要、翻译等）→ 需要 API
- 用户系统（收藏、历史）→ 需要 API

---

## 九、性能优化策略

- Astro 静态生成，零 JS 首发（非交互组件 0 JS）
- 交互组件按需 Hydration（`client:load` / `client:visible`）
- 图片懒加载
- Flowbite 按需导入（不用全量引入）
- CSS 按需（Tailwind purging）
- 字体优化（font-display: swap + 预加载）
- 关键 CSS 内联
- 预连接第三方域名（GA、AdSense、CDN）
- 构建时去除注释（Terser/ESBuild 配置）
- Web Worker 处理图像/PDF（后续优化）

---

## 十、实施阶段划分

| 阶段 | 内容 | 产出 |
|------|------|------|
| Phase 1 | 设计文档（当前） | 本文件 + 用户确认 |
| Phase 2 | 项目初始化 + 基础架构 + Layout | 项目骨架、导航、页脚、布局 |
| Phase 3 | 首页 + 分类页 | 首页 UI、5 个分类页 |
| Phase 4 | 计算器类工具页 | 9 个计算器 |
| Phase 5 | 转换器类工具页 | 2 个转换器 + 货币 API 层 |
| Phase 6 | 开发者工具页 | 9 个开发工具 |
| Phase 7 | 图像 + 文本工具页 | 4 个图像 + 6 个文本工具 |
| Phase 8 | Blog + Support 页面 + SEO | Blog 列表/详情、About/Contact/FAQ/Privacy/Terms |
| Phase 9 | 社交分享 + 性能优化 + 构建 | 分享组件、Web Worker、打包优化 |

---

## 十一、Cookie 同意弹窗

### 11.1 方案
- 底部固定横幅，非侵入式设计
- 文案： "We use cookies to improve your experience. By using MetisTools, you agree to our Privacy Policy."
- 三个按钮： **Accept All**（主按钮） / **Customize**（链接按钮） / **Reject All**（文字按钮）
- Customize 点击后弹出 Flowbite Modal，分类勾选：Necessary（强制勾选）/ Analytics / Advertising

### 11.2 技术实现
- 选择结果存入 `localStorage`（key: `cookie-preferences`）
- GA 和 AdSense 脚本仅在用户同意对应类别后才加载
- 组件：`src/components/ui/CookieConsent.astro`

---

## 十二、API 需求分析

### 12.1 当前需要 API 的工具

| 工具 | API | 用途 | 状态 |
|------|-----|------|------|
| Currency Converter | Exchange Rate API | 实时汇率数据 | 第三方 API（已有） |
| Password Generator | Have I Been Pwned | 检测密码是否泄露 | 可选，仅发送 SHA-1 前 5 位 |

### 12.2 无需 API 的工具（27 个）
所有计算器、开发者工具、图像工具、文本工具均为**纯前端实现**，不依赖任何后端 API：
- BMI/Age/Tip/Loan/Percentage/Date/Unit 等计算器 → 纯数学运算
- PDF 转换/合并/压缩 → 客户端 pdf-lib + pdfjs-dist
- 图像压缩/裁剪/格式转换 → Canvas API
- JSON/JWT/正则/编码/颜色等 → JS 原生能力
- QR Code → 客户端 qrcode 库
- 文本处理（大小写/去重/排序/统计）→ 字符串操作

### 12.3 `src/api/client.js` 抽象层价值
当前场景下，此抽象层主要用于：
1. 统一 Currency Converter 的汇率 API 调用
2. 为未来可能的新 API 功能提供统一入口（AI 文本处理、高级 PDF 操作等）
3. 一键切换第三方 API → 自研 API（仅改 BASE_URL）

即使短期内大部分工具不需要 API，保留此层不增加复杂度，收益大于成本。