# MetisTools 项目概览

> 详细设计见 `docs/design.md`

## 技术栈
Astro 4 + Tailwind 3 + Flowbite + ts + Cloudflare Pages（静态）

## 核心结构
src/
├── api/client.js          # 汇率等 API 统一调用
├── components/{ui,layout,seo,tool}  # UI 组件（Input/Select/Button等）
├── data/{site,seo,tools,navigation}.js  # 所有配置（禁止硬编码）
├── lib/                   # 纯函数逻辑
├── pages/{index,calculators,tools/*,blog/*}
├── styles/global.css
└── utils/{validation,format}.js

## 强制配置规则
- 所有字符串（标题/描述/链接/文案）必须从 `data/` 对应模块导入
- `site.js`: 站点名、URL、邮箱、社交、GA/AdSense ID
- `seo.js`: 每页 title/description/og
- `tools.js`: 工具元数据（29个）
- `navigation.js`: 菜单、页脚、面包屑映射

## 开发规则

### 代码
- 仅 JavaScript（.astro 内 script 也是 JS）
- 所有文本/数字/日期/下拉/文件上传等输入类元素（不含按钮）**必须**使用 `src/components/ui/` 下的组件。根据语义选择已有组件（如 `NumberInput`、`DateInput`、`SelectInput`），缺失则创建。严禁原生 `<input>`/`<select>`/`<textarea>`。
- 工具纯函数放 `src/lib/`，禁 DOM 操作
- 表单验证统一用 `src/utils/validation.js`
- API 调用统一走 `src/api/client.js`

### 工具页布局
- 桌面(≥1024px)左右分栏：左侧输入，右侧结果，首屏可见操作按钮
- 移动紧凑上下布局
- 底部必须含 200+ 字功能说明（从 seo.js 读），并链接相关博客

### 广告
- 用 `<AdPlaceholder slot format />` 占位
- 每页最多 3 广告，移动端无侧边栏广告

### SEO
- 每页用 `<SeoHead />` 传入 seo.js 数据
- JSON-LD: 首页 WebSite，工具页 HowTo，博客 Article，面包屑 BreadcrumbList
- 自动生成 robots.txt + sitemap.xml

## 响应风格
简洁，中文，不加"当然/好的"。只给答案或代码。

## 按需加载（需时请提问）
- 各工具详细规格（设计文档4）
- 验证函数列表（7.2）
- 广告布局策略（5）
- SEO Schema 示例（6.1）
- 性能优化（9）
- 实施阶段（10）

## 当前状态
**Phase 7 已完成**（图像工具类：Image Compressor、Image Format Converter、Image Cropper & Resizer、MP4 to GIF Converter；文本工具类：Case Converter、Encode/Decode、Regex Tester、Remove Duplicate Lines、Sort & Shuffle Lines、Text Analyzer）。  
**Phase 8 进行中**（Blog + Support 页面 + SEO：Blog 列表/详情页、About/Contact/FAQ/Privacy/Terms 等 Support 页面，以及 SEO 优化）。  
所有已有工具页已使用 `src/components/ui` 下的表单组件，后续新增或修改必须继续遵守表单组件规则。

## 约定
- 工具图标用 Flowbite 内置 SVG，不重复（名称见设计文档4.x表）
- 仅明亮模式（bg-gray-50），无暗色
- 日期时间用原生 Intl/Date，禁用 moment.js
- mp4 to gif相关内容忽略

## 参考
- 完整设计文档：`/docs/design.md`
- 可复用旧代码：设计文档1.2节