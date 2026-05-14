// 工具函数库（纯前端计算逻辑）

/**
 * 显示自定义提示消息（Toast）
 * @param {string} message - 消息文本
 * @param {string} type - 类型：'error', 'success', 'info'
 */
export function showMessage(message, type = 'info') {
  // 移除已存在的 toast
  const existing = document.querySelector('.toast-msg');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast-msg ${type}`;
  toast.textContent = message;
  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: type === 'error' ? '#ef4444' : '#10b981',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '40px',
    fontSize: '0.875rem',
    zIndex: '1000',
    opacity: '0',
    transition: 'opacity 0.2s'
  });
  document.body.appendChild(toast);
  setTimeout(() => toast.style.opacity = '1', 10);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

/**
 * 格式化数字，保留指定小数位
 */
export function formatNumber(value, decimals = 2) {
  return Number(value).toFixed(decimals);
}