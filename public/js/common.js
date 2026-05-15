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

// 通过 Cloudflare Worker 代理请求，解决 CORS
async function proxyFetch(url, options = {}) {
  const workerBase = 'https://proxy.flbdennis-fan.workers.dev';
  const proxyUrl = `${workerBase}?target=${encodeURIComponent(url)}`;
  const headers = { ...options.headers, 'Origin': '' };
  return fetch(proxyUrl, { ...options, headers });
}

// 极简文件上传组件（按钮式，紧凑）
function initFileUpload(containerId, acceptTypes, onFileSelected) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // 创建包装元素
  const wrapper = document.createElement('div');
  wrapper.className = 'flex items-center gap-3';

  // 按钮
  const uploadBtn = document.createElement('button');
  uploadBtn.type = 'button';
  uploadBtn.className = 'bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 px-4 rounded-full transition';
  uploadBtn.textContent = 'Choose File';

  // 文件名显示
  const fileNameSpan = document.createElement('span');
  fileNameSpan.className = 'text-sm text-gray-500';
  fileNameSpan.textContent = 'No file chosen';

  // 隐藏的 file input
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = acceptTypes.join(',');
  fileInput.className = 'hidden';

  wrapper.appendChild(uploadBtn);
  wrapper.appendChild(fileNameSpan);
  container.appendChild(wrapper);
  container.appendChild(fileInput);

  uploadBtn.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length) {
      const file = e.target.files[0];
      fileNameSpan.textContent = file.name;
      onFileSelected(file);
    } else {
      fileNameSpan.textContent = 'No file chosen';
    }
  });
}