// 全局自定义弹窗函数（替代 alert）
function showMessage(message, type = 'info') {
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