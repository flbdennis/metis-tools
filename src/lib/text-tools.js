// src/lib/text-tools.js

// --- 1. 大小写与命名风格转换 ---
export const caseConverters = {
    uppercase: (s) => s.toUpperCase(),
    lowercase: (s) => s.toLowerCase(),
    // 句首大写: 将每个句子的第一个字母转为大写，其余保持小写
    sentencecase: (s) => s.replace(/(^\s*\w|[.!?]\s+\w)/g, c => c.toUpperCase()),
    // 标题大小写: 将每个单词的首字母转为大写，其余字母转为小写
    titlecase: (s) => s.split(/\s+/).map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' '),
};

export const namingConverters = {
    // 驼峰式 (camelCase): "hello world" -> "helloWorld"
    camelcase: (s) => s.toLowerCase().replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : ''),
    // 帕斯卡式 (PascalCase): "hello world" -> "HelloWorld"
    pascalcase: (s) => {
        const camel = namingConverters.camelcase(s);
        return camel.charAt(0).toUpperCase() + camel.slice(1);
    },
    // 下划线式 (snake_case): "hello world" -> "hello_world"
    snakecase: (s) => s.trim().toLowerCase().replace(/[\s-]+/g, '_'),
    // 短横线式 (kebab-case): "hello world" -> "hello-world"
    kebabcase: (s) => s.trim().toLowerCase().replace(/[\s_]+/g, '-'),
};

// --- 2. 编码与解码---
export const encoders = {
    // Base64编码 (注意处理UTF-8)
    base64Encode: (str) => btoa(unescape(encodeURIComponent(str))),
    base64Decode: (str) => decodeURIComponent(escape(atob(str))),
    // URL编码 (encodeURIComponent)
    urlEncode: (str) => encodeURIComponent(str),
    urlDecode: (str) => decodeURIComponent(str),
    // HTML实体编码
    htmlEncode: (str) => str.replace(/[&<>]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;'})[m]),
    htmlDecode: (str) => str.replace(/&amp;|&lt;|&gt;/g, m => ({'&amp;':'&','&lt;':'<','&gt;':'>'})[m]),
    // Hex 编码
    hexEncode: (str) => Array.from(new TextEncoder().encode(str), b => b.toString(16).padStart(2, '0')).join(''),
    hexDecode: (str) => {
        const clean = str.replace(/\s/g, '');
        const bytes = [];
        for (let i = 0; i < clean.length; i += 2) {
            bytes.push(parseInt(clean.substring(i, i + 2), 16));
        }
        return new TextDecoder().decode(new Uint8Array(bytes));
    },
    // Base32 编码 (RFC 4648)
    base32Encode: (str) => {
        const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
        const bytes = new TextEncoder().encode(str);
        let bits = 0, value = 0, output = '';
        for (let i = 0; i < bytes.length; i++) {
            value = (value << 8) | bytes[i];
            bits += 8;
            while (bits >= 5) {
                output += ALPHABET[(value >>> (bits - 5)) & 31];
                bits -= 5;
            }
        }
        if (bits > 0) output += ALPHABET[(value << (5 - bits)) & 31];
        const pad = (8 - output.length % 8) % 8;
        return output + '='.repeat(pad);
    },
    base32Decode: (str) => {
        const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
        const clean = str.toUpperCase().replace(/[^A-Z2-7=]/g, '');
        let bits = 0, value = 0;
        const bytes = [];
        for (let i = 0; i < clean.length; i++) {
            if (clean[i] === '=') break;
            value = (value << 5) | ALPHABET.indexOf(clean[i]);
            bits += 5;
            if (bits >= 8) {
                bytes.push((value >>> (bits - 8)) & 255);
                bits -= 8;
            }
        }
        return new TextDecoder().decode(new Uint8Array(bytes));
    },
    // ROT13 编码（与解码相同）
    rot13Encode: (str) => str.replace(/[a-zA-Z]/g, c => String.fromCharCode((c <= 'Z' ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26)),
    rot13Decode: (str) => str.replace(/[a-zA-Z]/g, c => String.fromCharCode((c <= 'Z' ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26)),
};

// 自动检测编码类型
export function detectEncoding(str) {
    if (!str || !str.trim()) return 'unknown';
    const s = str.trim();
    // Base64 pattern
    if (/^[A-Za-z0-9+/]+=*$/.test(s) && s.length > 4 && s.length % 4 === 0) return 'base64';
    // Base32 pattern
    if (/^[A-Z2-7]+=*$/i.test(s) && s.length >= 8) return 'base32';
    // Hex pattern
    if (/^[0-9A-Fa-f\s]+$/.test(s) && s.replace(/\s/g, '').length % 2 === 0 && s.replace(/\s/g, '').length >= 4) return 'hex';
    // URL encoded pattern
    if (/%[0-9A-Fa-f]{2}/.test(s)) return 'url';
    // HTML entities pattern
    if (/&(amp|lt|gt|#\d+);/.test(s)) return 'html';
    // ROT13 - looks like English text
    return 'unknown';
}

// --- 3. 文本清洗与去重---
// 保留原始顺序的按行去重
export const removeDuplicateLines = (text) => {
    const lines = text.split(/\r?\n/);
    const seen = new Set();
    return lines.filter(line => {
        if (seen.has(line)) return false;
        seen.add(line);
        return true;
    }).join('\n');
};
// 移除空行
export const removeEmptyLines = (text) => text.split(/\r?\n/).filter(line => line.trim() !== '').join('\n');
// 移除首尾空白（仅首尾）
export const trimWhitespace = (text) => text.trim();
// 压缩连续空格：去除首尾空白，并将内部所有连续空白（空格、制表符、换行）替换为单个空格
export const collapseSpaces = (text) => text.trim().replace(/\s+/g, ' ');

// --- 4. 文本排序与打乱---
// 按字母顺序排序
export const sortLinesAlphabetically = (text, order = 'asc') => {
    const lines = text.split(/\r?\n/);
    lines.sort((a, b) => order === 'asc' ? a.localeCompare(b) : b.localeCompare(a));
    return lines.join('\n');
};
// 随机打乱行顺序 (Fisher-Yates 算法)
export const shuffleLines = (text) => {
    const lines = text.split(/\r?\n/);
    for (let i = lines.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [lines[i], lines[j]] = [lines[j], lines[i]];
    }
    return lines.join('\n');
};

// --- 5. 文本统计---
export const textStats = (text) => {
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    const characters = text.length;
    const lines = text.split(/\r?\n/).length;
    return { words: words.length, characters, lines };
};

// 音节计数（英语近似算法）
function countSyllables(word) {
    word = word.toLowerCase().replace(/[^a-z]/g, '');
    if (word.length <= 3) return 1;
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    const match = word.match(/[aeiouy]{1,2}/g);
    return match ? match.length : 1;
}

// 句子计数
function countSentences(text) {
    const matches = text.match(/[^.!?\n]+[.!?]+/g);
    return matches ? matches.length : 0;
}

// 段落计数
function countParagraphs(text) {
    const paras = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    return paras.length || 1;
}

// Flesch Reading Ease
function fleschReadingEase(text) {
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;
    if (wordCount === 0) return 0;
    const sentenceCount = countSentences(text) || 1;
    let syllableCount = 0;
    for (const w of words) syllableCount += countSyllables(w);
    const score = 206.835 - 1.015 * (wordCount / sentenceCount) - 84.6 * (syllableCount / wordCount);
    return Math.round(Math.max(0, Math.min(120, score)));
}

// Flesch-Kincaid Grade Level
function fleschKincaidGrade(text) {
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;
    if (wordCount === 0) return 0;
    const sentenceCount = countSentences(text) || 1;
    let syllableCount = 0;
    for (const w of words) syllableCount += countSyllables(w);
    const score = 0.39 * (wordCount / sentenceCount) + 11.8 * (syllableCount / wordCount) - 15.59;
    return Math.round(Math.max(0, score * 10)) / 10;
}

// 关键词密度分析
function keywordDensity(text) {
    const stopWords = new Set([
        'the','a','an','is','are','was','were','be','been','being','have','has','had',
        'do','does','did','will','would','could','should','may','might','can','shall',
        'i','you','he','she','it','we','they','me','him','her','us','them','my','your',
        'his','its','our','their','mine','yours','hers','ours','theirs','this','that',
        'these','those','in','on','at','to','for','of','from','by','with','about',
        'as','into','through','during','before','after','above','below','between',
        'and','but','or','nor','not','so','yet','both','either','neither','each',
        'every','all','any','few','more','most','other','some','such','no','than',
        'too','very','just','also','if','then','else','when','where','why','how',
    ]);
    const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 1 && !stopWords.has(w));
    const total = words.length;
    const freq = {};
    for (const w of words) freq[w] = (freq[w] || 0) + 1;
    return Object.entries(freq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([word, count]) => ({ word, count, density: total > 0 ? Math.round(count / total * 1000) / 10 : 0 }));
}

// 阅读/朗读时间估算
function readingTime(wordCount, wpm = 225) {
    const mins = Math.max(1, Math.round(wordCount / wpm));
    if (mins < 1) return '< 1 min';
    return mins === 1 ? '1 min' : `${mins} mins`;
}

function speakingTime(wordCount, wpm = 130) {
    const mins = Math.max(1, Math.round(wordCount / wpm));
    if (mins < 1) return '< 1 min';
    return mins === 1 ? '1 min' : `${mins} mins`;
}

export const analyzeText = (text) => {
    if (!text || !text.trim()) {
        return {
            characters: 0, charactersNoSpaces: 0, words: 0, sentences: 0,
            paragraphs: 0, lines: 0, syllables: 0, avgWordLength: 0,
            longestWord: '', shortestWord: '', fleschEase: 0, fleschKincaid: 0,
            topKeywords: [], readingTime: '0 min', speakingTime: '0 min',
        };
    }

    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    const lines = text.split(/\r?\n/).length;
    const sentenceCount = countSentences(text);
    const paragraphCount = countParagraphs(text);

    let syllableCount = 0;
    for (const w of words) syllableCount += countSyllables(w);

    const sortedByLen = [...words].sort((a, b) => a.length - b.length);
    const longestWord = sortedByLen[sortedByLen.length - 1] || '';
    const shortestWord = sortedByLen[0] || '';
    const avgWordLength = wordCount > 0 ? Math.round(charactersNoSpaces / wordCount * 10) / 10 : 0;

    const flesch = fleschReadingEase(text);
    const fk = fleschKincaidGrade(text);
    const topKeywords = keywordDensity(text);

    return {
        characters, charactersNoSpaces, words: wordCount, sentences: sentenceCount,
        paragraphs: paragraphCount, lines, syllables: syllableCount,
        avgWordLength, longestWord, shortestWord,
        fleschEase: flesch, fleschKincaid: fk,
        topKeywords,
        readingTime: readingTime(wordCount),
        speakingTime: speakingTime(wordCount),
    };
};

// --- 6. 正则表达式测试器功能---
export const testRegex = (pattern, flags, testString) => {
    try {
        const regex = new RegExp(pattern, flags);
        const matches = [...testString.matchAll(regex)];
        return {
            isValid: true,
            matches: matches.map(m => ({ match: m[0], index: m.index, groups: m.slice(1) })),
            count: matches.length,
        };
    } catch (error) {
        return { isValid: false, error: error.message };
    }
};