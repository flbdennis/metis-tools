// 表单验证工具集 —— 所有工具页面统一使用
// 每个函数返回 { valid: boolean, message: string }

// ===== 通用数值验证 =====

// 验证正数
export function isPositiveNumber(val) {
  const num = parseFloat(val);
  if (isNaN(num)) return { valid: false, message: 'Please enter a valid number.' };
  if (num <= 0) return { valid: false, message: 'Please enter a positive number.' };
  return { valid: true, message: '' };
}

// 验证非负数（允许 0）
export function isNonNegativeNumber(val) {
  const num = parseFloat(val);
  if (isNaN(num)) return { valid: false, message: 'Please enter a valid number.' };
  if (num < 0) return { valid: false, message: 'Value cannot be negative.' };
  return { valid: true, message: '' };
}

// 验证正整数
export function isPositiveInteger(val) {
  const num = Number(val);
  if (!Number.isInteger(num)) return { valid: false, message: 'Please enter a whole number.' };
  if (num <= 0) return { valid: false, message: 'Please enter a positive whole number.' };
  return { valid: true, message: '' };
}

// 验证数值范围
export function isInRange(val, min, max, label = 'Value') {
  const num = parseFloat(val);
  if (isNaN(num)) return { valid: false, message: 'Please enter a valid number.' };
  if (num < min || num > max) return { valid: false, message: `${label} must be between ${min} and ${max}.` };
  return { valid: true, message: '' };
}

// ===== 格式验证 =====

// 验证邮箱
export function isValidEmail(val) {
  if (!val.trim()) return { valid: false, message: 'Please enter an email address.' };
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(val)) return { valid: false, message: 'Please enter a valid email address.' };
  return { valid: true, message: '' };
}

// 验证 URL
export function isValidUrl(val) {
  if (!val.trim()) return { valid: false, message: 'Please enter a URL.' };
  try {
    new URL(val);
    return { valid: true, message: '' };
  } catch {
    return { valid: false, message: 'Please enter a valid URL (e.g., https://example.com).' };
  }
}

// 验证 HEX 颜色（3/4/6/8 位）
export function isValidHex(val) {
  if (!val.trim()) return { valid: false, message: 'Please enter a HEX color code.' };
  const hexRegex = /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{4}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/;
  if (!hexRegex.test(val)) return { valid: false, message: 'Please enter a valid HEX color (e.g., #FF5500).' };
  return { valid: true, message: '' };
}

// 验证日期格式
export function isValidDate(val) {
  if (!val.trim()) return { valid: false, message: 'Please select a date.' };
  const date = new Date(val);
  if (isNaN(date.getTime())) return { valid: false, message: 'Please enter a valid date.' };
  return { valid: true, message: '' };
}

// 验证日期不为未来
export function isNotFutureDate(val) {
  const date = new Date(val);
  if (date > new Date()) return { valid: false, message: 'Date cannot be in the future.' };
  return { valid: true, message: '' };
}

// 验证起始日期 ≤ 结束日期
export function isDateRangeValid(startVal, endVal) {
  if (new Date(startVal) > new Date(endVal)) {
    return { valid: false, message: 'Start date must be before or equal to end date.' };
  }
  return { valid: true, message: '' };
}

// ===== 文件验证 =====

// 允许的文件类型映射
const ALLOWED_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  pdf: ['application/pdf'],
  video: ['video/mp4'],
  zip: ['application/zip', 'application/x-zip-compressed'],
};

// 验证文件类型
export function isFileType(file, typeCategory) {
  const allowed = ALLOWED_TYPES[typeCategory] || [];
  if (!file) return { valid: false, message: 'Please select a file.' };
  if (!allowed.includes(file.type)) {
    const types = allowed.map(t => t.split('/')[1].toUpperCase()).join(', ');
    return { valid: false, message: `Invalid file type. Allowed: ${types}.` };
  }
  return { valid: true, message: '' };
}

// 验证文件大小
export function isFileSize(file, maxBytes, label = 'File') {
  if (!file) return { valid: false, message: 'Please select a file.' };
  if (file.size > maxBytes) {
    const maxMB = (maxBytes / (1024 * 1024)).toFixed(0);
    const actualMB = (file.size / (1024 * 1024)).toFixed(1);
    return { valid: false, message: `${label} is ${actualMB}MB. Maximum size is ${maxMB}MB.` };
  }
  return { valid: true, message: '' };
}

// ===== 输入实时限制 =====

// 限制小数位数（用于 input 事件）
export function limitDecimalPlaces(value, maxDecimals) {
  const parts = value.split('.');
  if (parts.length === 2 && parts[1].length > maxDecimals) {
    return parts[0] + '.' + parts[1].slice(0, maxDecimals);
  }
  return value;
}

// 只允许数字和小数点输入
export function restrictNumericInput(value, allowDecimal = true, allowNegative = false) {
  let pattern = allowNegative ? '[^0-9.\\-]' : '[^0-9.]';
  let cleaned = value.replace(new RegExp(pattern, 'g'), '');
  // 保证只有一个负号在开头
  if (allowNegative && cleaned.startsWith('-')) {
    cleaned = '-' + cleaned.slice(1).replace(/-/g, '');
  }
  // 保证只有一个小数点
  if (allowDecimal) {
    const parts = cleaned.split('.');
    if (parts.length > 2) {
      cleaned = parts[0] + '.' + parts.slice(1).join('');
    }
  }
  return cleaned;
}

// ===== DOM 辅助 =====

// 为输入框绑定实时输入过滤
export function bindInputFilter(el, filterFn) {
  el.addEventListener('input', () => {
    const cursorPos = el.selectionStart;
    const filtered = filterFn(el.value);
    if (filtered !== el.value) {
      el.value = filtered;
      // 恢复光标位置
      el.setSelectionRange(
        Math.min(cursorPos, filtered.length),
        Math.min(cursorPos, filtered.length)
      );
    }
  });
}

// 显示/清除字段错误
export function showFieldError(el, message) {
  el.classList.add('input-error');
  el.classList.remove('input-success');
  const helper = el.parentElement.querySelector('.field-error');
  if (helper) {
    helper.textContent = message;
    helper.classList.remove('hidden');
  }
}

export function clearFieldError(el) {
  el.classList.remove('input-error');
  const helper = el.parentElement.querySelector('.field-error');
  if (helper) {
    helper.textContent = '';
    helper.classList.add('hidden');
  }
}

export function showFieldSuccess(el) {
  el.classList.add('input-success');
  el.classList.remove('input-error');
}
