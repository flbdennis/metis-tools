// 开发者工具纯函数库 —— 禁止 DOM 操作

// ===== Password Generator =====

const UPPER = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
const UPPER_AMBIGUOUS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWER = 'abcdefghjkmnpqrstuvwxyz';
const LOWER_AMBIGUOUS = 'abcdefghijklmnopqrstuvwxyz';
const DIGITS = '23456789';
const DIGITS_AMBIGUOUS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

// 密码强度评估
export function evaluatePasswordStrength(password) {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 2) return { level: 'Weak', color: 'text-red-500 bg-red-50', pct: 25 };
  if (score <= 3) return { level: 'Fair', color: 'text-orange-500 bg-orange-50', pct: 45 };
  if (score <= 5) return { level: 'Strong', color: 'text-yellow-600 bg-yellow-50', pct: 70 };
  return { level: 'Very Strong', color: 'text-green-500 bg-green-50', pct: 100 };
}

// 计算信息熵（bits）
export function calculateEntropy(password, charPoolSize) {
  if (!password || password.length === 0) return 0;
  // 近似熵 = log2(poolSize^length)
  if (charPoolSize <= 0) return 0;
  return Math.round(password.length * Math.log2(charPoolSize) * 10) / 10;
}

// 生成随机密码
export function generatePassword({ length = 16, upper = true, lower = true, digits = true, symbols = true, excludeAmbiguous = false }) {
  const upperChars = excludeAmbiguous ? UPPER : UPPER_AMBIGUOUS;
  const lowerChars = excludeAmbiguous ? LOWER : LOWER_AMBIGUOUS;
  const digitChars = excludeAmbiguous ? DIGITS : DIGITS_AMBIGUOUS;

  let pool = '';
  const required = [];

  if (upper) { pool += upperChars; required.push(upperChars); }
  if (lower) { pool += lowerChars; required.push(lowerChars); }
  if (digits) { pool += digitChars; required.push(digitChars); }
  if (symbols) { pool += SYMBOLS; required.push(SYMBOLS); }

  if (!pool) return { password: '', entropy: 0, poolSize: 0 };

  const array = new Uint32Array(length);
  crypto.getRandomValues(array);

  // 确保每种选中的字符类型至少出现一次
  let chars = [];
  for (let i = 0; i < required.length && i < length; i++) {
    const set = required[i];
    chars.push(set[array[i] % set.length]);
  }

  for (let i = chars.length; i < length; i++) {
    chars.push(pool[array[i] % pool.length]);
  }

  // Fisher-Yates 洗牌
  for (let i = chars.length - 1; i > 0; i--) {
    const j = array[array.length - 1 - i % (array.length - i)] % (i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }

  const password = chars.join('');
  return { password, entropy: calculateEntropy(password, pool.length), poolSize: pool.length };
}

// 生成易记密码（passphrase 模式）
const WORD_LIST = [
  'alpha', 'bravo', 'charlie', 'delta', 'echo', 'foxtrot', 'golf', 'hotel',
  'india', 'juliet', 'kilo', 'lima', 'mike', 'november', 'oscar', 'papa',
  'quebec', 'romeo', 'sierra', 'tango', 'uniform', 'victor', 'whiskey', 'xray',
  'yankee', 'zulu', 'apple', 'banana', 'cherry', 'dragon', 'eagle', 'falcon',
  'grape', 'honey', 'iron', 'jade', 'kiwi', 'lemon', 'mango', 'noble',
  'olive', 'pearl', 'quartz', 'ruby', 'silver', 'tiger', 'ultra', 'violet',
  'willow', 'xenon', 'yeti', 'zebra', 'amber', 'blaze', 'cloud', 'dusk',
  'ember', 'frost', 'glacier', 'haven', 'ivory', 'jazz', 'karma', 'lotus',
  'maple', 'nova', 'onyx', 'phoenix', 'quest', 'raven', 'storm', 'thorn',
  'unity', 'vapor', 'wonder', 'zephyr', 'arc', 'bolt', 'creek', 'dawn',
  'echo', 'flame', 'gale', 'horizon', 'ice', 'jade', 'knoll', 'lake',
  'mist', 'north', 'oak', 'pine', 'ridge', 'stone', 'tide', 'vale',
  'wave', 'brook', 'cliff', 'dune', 'fern', 'glen', 'heath', 'isle',
  'meadow', 'moor', 'peak', 'reef', 'shore', 'summit', 'trail', 'wood',
  'bear', 'deer', 'fox', 'hawk', 'lynx', 'otter', 'puma', 'wolf',
  'basil', 'cumin', 'dill', 'fennel', 'ginger', 'herb', 'mint', 'sage',
  'birch', 'cedar', 'elm', 'fir', 'holly', 'juniper', 'laurel', 'myrtle',
];

export function generatePassphrase({ wordCount = 4, separator = '-', addNumber = true, addSymbol = true, capitalize = true }) {
  const arr = new Uint32Array(wordCount + 2);
  crypto.getRandomValues(arr);

  const words = [];
  for (let i = 0; i < wordCount; i++) {
    let w = WORD_LIST[arr[i] % WORD_LIST.length];
    if (capitalize) w = w.charAt(0).toUpperCase() + w.slice(1);
    words.push(w);
  }

  let passphrase = words.join(separator);
  if (addNumber) passphrase += arr[wordCount] % 100;
  if (addSymbol) {
    const symList = '!@#$%&*';
    passphrase += symList[arr[wordCount + 1] % symList.length];
  }

  return { password: passphrase, entropy: calculateEntropy(passphrase, WORD_LIST.length), poolSize: WORD_LIST.length };
}

// 批量生成密码
export function generatePasswordBatch(count, options) {
  const passwords = [];
  for (let i = 0; i < count; i++) {
    passwords.push(generatePassword(options).password);
  }
  return passwords;
}

// ===== UUID Generator =====

// 生成单个 UUID v4
export function generateUUIDv4(format = 'lowercase') {
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  arr[6] = (arr[6] & 0x0f) | 0x40; // version 4
  arr[8] = (arr[8] & 0x3f) | 0x80; // variant 10

  const hex = Array.from(arr, b => b.toString(16).padStart(2, '0')).join('');

  if (format === 'uppercase') return hex.toUpperCase();
  if (format === 'no-hyphens') return hex.toLowerCase();

  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

// 批量生成 UUID
export function generateUUIDBatch(count, format = 'lowercase') {
  const uuids = [];
  for (let i = 0; i < count; i++) {
    uuids.push(generateUUIDv4(format));
  }
  return uuids;
}

// ===== Lorem Ipsum Generator =====

const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'ut', 'aliquip', 'ex', 'ea',
  'commodo', 'consequat', 'duis', 'aute', 'irure', 'dolor', 'in', 'reprehenderit',
  'voluptate', 'velit', 'esse', 'cillum', 'dolore', 'eu', 'fugiat', 'nulla',
  'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident',
  'sunt', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id', 'est',
  'laborum', 'perspiciatis', 'unde', 'omnis', 'iste', 'natus', 'error', 'sit',
  'voluptatem', 'accusantium', 'doloremque', 'laudantium', 'totam', 'rem',
  'aperiam', 'eaque', 'ipsa', 'quae', 'ab', 'illo', 'inventore', 'veritatis',
  'quasi', 'architecto', 'beatae', 'vitae', 'dicta', 'sunt', 'explicabo',
  'nemo', 'enim', 'ipsam', 'quia', 'voluptas', 'aspernatur', 'aut', 'odit',
  'fugit', 'consequuntur', 'magni', 'dolores', 'eos', 'ratione', 'sequi',
  'nesciunt', 'neque', 'porro', 'quisquam', 'dolorem', 'adipisci', 'numquam',
  'modi', 'tempora', 'incidunt', 'magnam', 'quaerat', 'voluptatem',
];

function randomLoremWords(count) {
  const arr = new Uint32Array(count);
  crypto.getRandomValues(arr);
  return Array.from(arr, (v, i) => LOREM_WORDS[v % LOREM_WORDS.length]);
}

function wordsToSentence(words) {
  let s = words.join(' ');
  s = s.charAt(0).toUpperCase() + s.slice(1);
  if (!/[.!?]$/.test(s)) s += '.';
  return s;
}

export function generateLorem({ mode = 'paragraphs', count = 3, startWithLorem = true, asHtml = false }) {
  const wordsPerSentence = () => Math.floor(Math.random() * 12) + 5; // 5-16
  const sentencesPerParagraph = () => Math.floor(Math.random() * 4) + 3; // 3-6

  let paragraphs = [];

  for (let p = 0; p < (mode === 'paragraphs' ? count : Math.max(1, Math.ceil(count / 12))); p++) {
    const sCount = mode === 'sentences' ? count : sentencesPerParagraph();
    const sentences = [];

    for (let s = 0; s < sCount; s++) {
      let wCount;
      if (mode === 'words') wCount = count;
      else if (mode === 'characters') wCount = Math.ceil(count / 5);
      else wCount = wordsPerSentence();

      let words = randomLoremWords(wCount);

      if (startWithLorem && p === 0 && s === 0) {
        words = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', ...words.slice(5)];
      }

      sentences.push(wordsToSentence(words));

      if (mode === 'words' || mode === 'characters') break;
    }

    paragraphs.push(sentences.join(' '));
    if (mode === 'sentences') break;
  }

  let text = paragraphs.join('\n\n');

  if (mode === 'characters') {
    text = text.substring(0, count);
    // 保证不在单词中间截断
    const lastSpace = text.lastIndexOf(' ');
    if (lastSpace > 0) text = text.substring(0, lastSpace) + '.';
  }

  if (asHtml) {
    text = paragraphs.map(p => `<p>${p}</p>`).join('\n');
  }

  const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
  const charCount = text.length;

  return { text, stats: { words: wordCount, characters: charCount, paragraphs: (asHtml ? paragraphs.length : text.split('\n\n').length) } };
}

// ===== Unix Timestamp =====

export function timestampToDate(unixSeconds) {
  const ms = unixSeconds > 1e12 ? unixSeconds : unixSeconds * 1000;
  const date = new Date(ms);
  return {
    utc: date.toISOString().replace('T', ' ').replace('Z', ''),
    iso: date.toISOString(),
    local: date.toString(),
    localeString: date.toLocaleString(),
    dateOnly: date.toISOString().split('T')[0],
    timeOnly: date.toISOString().split('T')[1].replace('Z', ''),
    dayOfWeek: date.toLocaleString('en-US', { weekday: 'long' }),
    unixSeconds: Math.floor(ms / 1000),
    unixMilliseconds: ms,
  };
}

export function dateToTimestamp(dateInput) {
  const date = new Date(dateInput);
  const ms = date.getTime();
  return {
    unixSeconds: Math.floor(ms / 1000),
    unixMilliseconds: ms,
    iso: date.toISOString(),
    utc: date.toISOString().replace('T', ' ').replace('Z', ''),
  };
}

export function getCurrentTimestamp() {
  const now = Date.now();
  return {
    unixSeconds: Math.floor(now / 1000),
    unixMilliseconds: now,
    iso: new Date(now).toISOString(),
    utc: new Date(now).toISOString().replace('T', ' ').replace('Z', ''),
  };
}

// ===== JSON Formatter =====

// 格式化 JSON
export function formatJSON(input, indentSize = 2) {
  const parsed = JSON.parse(input);
  return JSON.stringify(parsed, null, indentSize);
}

// 压缩 JSON
export function minifyJSON(input) {
  const parsed = JSON.parse(input);
  return JSON.stringify(parsed);
}

// 验证 JSON 并返回错误信息
export function validateJSON(input) {
  try {
    const parsed = JSON.parse(input);
    return { valid: true, data: parsed, error: null };
  } catch (e) {
    // 尝试提取行号和位置
    const match = e.message.match(/position\s+(\d+)/);
    const pos = match ? parseInt(match[1]) : null;
    let line = null;
    if (pos !== null) {
      line = input.substring(0, pos).split('\n').length;
    }
    return { valid: false, data: null, error: e.message, line };
  }
}
