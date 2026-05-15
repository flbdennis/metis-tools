// src/lib/pdf-tools.js
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocument } from 'pdf-lib';

// 设置 worker (使用 CDN 或本地)
// 注意：需要确保 pdfjs-dist 版本匹配
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

/**
 * 将 PDF 转换为图片数组
 * @param {File} pdfFile - PDF 文件
 * @param {string} imageType - 'image/png' 或 'image/jpeg'
 * @param {number} scale - 缩放比例，默认 1.5
 * @returns {Promise<Blob[]>}
 */
export async function pdfToImages(pdfFile, imageType = 'image/png', scale = 1.5) {
  const arrayBuffer = await pdfFile.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;
  const blobs = [];

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvasContext: context, viewport }).promise;
    const blob = await new Promise(resolve => canvas.toBlob(resolve, imageType));
    blobs.push(blob);
  }
  return blobs;
}

/**
 * 提取 PDF 文本
 * @param {File} pdfFile
 * @returns {Promise<string>}
 */
export async function pdfToText(pdfFile) {
  const arrayBuffer = await pdfFile.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map(item => item.str).join(' ');
    fullText += pageText + '\n';
  }
  return fullText;
}

/**
 * 将 PDF 转换为 HTML（简单封装文本，不保留复杂样式）
 * @param {File} pdfFile
 * @returns {Promise<string>}
 */
export async function pdfToHtml(pdfFile) {
  const text = await pdfToText(pdfFile);
  const escapedText = escapeHtml(text);
  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Converted PDF</title></head>
<body><pre>${escapedText}</pre></body>
</html>`;
}

function escapeHtml(str) {
  return str.replace(/[&<>]/g, function(m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
}