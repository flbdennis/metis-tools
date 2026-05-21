// API 调用层 —— 统一封装所有 HTTP 请求
// 切换自研 API 时，只需修改 API_BASE_URL 和相关配置

// ===== 配置 =====
const API_BASE_URL = ''; // 预留：自研 API 地址，如 'https://api.metistools.com/v1'
const EXCHANGE_API_URL = 'https://api.exchangerate-api.com/v4/latest/';
const REQUEST_TIMEOUT = 15000; // 默认超时 15 秒

// ===== 通用请求封装 =====

// 统一 fetch 封装：超时、错误处理、JSON 解析
async function apiFetch(url, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  const defaultHeaders = {
    'Accept': 'application/json',
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }

    throw new Error(`Network error: ${error.message}`);
  }
}

// 公开的 API 请求方法（用于自研 API）
export async function get(endpoint, params = {}) {
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });
  return apiFetch(url.toString());
}

export async function post(endpoint, data = {}) {
  return apiFetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

// ===== 汇率 API =====

// 获取实时汇率（当前使用 open.er-api.com，免费，无需 key）
export async function fetchExchangeRates(baseCurrency = 'USD') {
  const url = `${EXCHANGE_API_URL}${baseCurrency}`;
  const data = await apiFetch(url);

  if (!data || !data.rates) {
    throw new Error('Failed to fetch exchange rates.');
  }

  return {
    base: data.base_code || baseCurrency,
    rates: data.rates,
    lastUpdated: data.time_last_update_utc || new Date().toISOString(),
    nextUpdate: data.time_next_update_utc || null,
  };
}

// 换算货币
export async function convertCurrency(amount, from, to) {
  const { rates } = await fetchExchangeRates(from);

  if (!rates[to]) {
    throw new Error(`Currency "${to}" is not supported.`);
  }

  return {
    amount,
    from,
    to,
    result: amount * rates[to],
    rate: rates[to],
  };
}

// ===== 未来 API 扩展预留 =====
// 以下为预留的空实现，后续自研 API 上线后补充

// PDF 高级操作（Word/Excel 转换等）
// export async function pdfAdvancedOperation(file, operation, options = {}) {...}

// AI 文本处理（摘要、翻译等）
// export async function aiTextProcess(text, mode, options = {}) {...}

// 用户系统（收藏、历史记录等）
// export async function userFavorites(action, data = {}) {...}
