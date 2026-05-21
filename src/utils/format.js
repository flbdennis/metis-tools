// 格式化工具函数 —— 统一的数据展示格式

// ===== 数字格式化 =====

// 千分位分隔
export function formatNumber(num, decimals = 0) {
  return Number(num).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

// 百分比
export function formatPercent(num, decimals = 1) {
  return Number(num).toLocaleString('en-US', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

// 货币
export function formatCurrency(amount, currency = 'USD', decimals = 2) {
  return Number(amount).toLocaleString('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

// 文件大小
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = bytes / Math.pow(1024, i);
  return `${size.toFixed(i === 0 ? 0 : 2)} ${units[i]}`;
}

// ===== 日期时间格式化 =====

// 日期 → 友好格式（Jan 15, 2024）
export function formatDate(date) {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// 日期 → ISO 格式（2024-01-15）
export function formatDateISO(date) {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}

// Unix 时间戳 → 日期时间字符串
export function formatTimestamp(ts, showTime = true) {
  const d = new Date(ts * 1000);
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...(showTime && { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  };
  return d.toLocaleString('en-US', options);
}

// 秒数 → 人类可读时长
export function formatDuration(totalSeconds) {
  if (totalSeconds < 60) return `${totalSeconds} seconds`;
  if (totalSeconds < 3600) {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m} min${m > 1 ? 's' : ''}${s > 0 ? ` ${s} sec` : ''}`;
  }
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  return `${h} hr${h > 1 ? 's' : ''}${m > 0 ? ` ${m} min` : ''}`;
}

// ===== 文本格式化 =====

// 截断文本 + 省略号
export function truncateText(text, maxLength = 100) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

// 首字母大写
export function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// Slug → 显示名（hello-world → Hello World）
export function slugToDisplay(slug) {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// ===== SEO 辅助 =====

// 生成页面元描述（截断至 160 字符）
export function truncateDescription(text, maxLength = 160) {
  return truncateText(text, maxLength);
}

// 拼接页面 title
export function seoTitle(pageTitle, siteName = 'MetisTools') {
  const full = `${pageTitle} | ${siteName}`;
  return full.length > 60 ? pageTitle : full;
}

// ===== 复制到剪贴板 =====
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return { success: true, message: 'Copied to clipboard!' };
  } catch {
    // 降级方案
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const result = document.execCommand('copy');
    document.body.removeChild(textarea);
    return result
      ? { success: true, message: 'Copied to clipboard!' }
      : { success: false, message: 'Failed to copy.' };
  }
}
