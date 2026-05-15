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
};

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