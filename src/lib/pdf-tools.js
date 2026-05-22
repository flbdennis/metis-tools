// src/lib/pdf-tools.js —— 动态导入，按需加载 pdfjs-dist / pdf-lib
let _pdfjsLib;
let _PDFDocument;
let _initPromise;

async function initPdfjs() {
  if (_pdfjsLib) return _pdfjsLib;
  if (!_initPromise) {
    _initPromise = (async () => {
      const [pdfjsMod, workerUrlMod] = await Promise.all([
        import('pdfjs-dist'),
        import('pdfjs-dist/build/pdf.worker.min.mjs?url'),
      ]);
      pdfjsMod.GlobalWorkerOptions.workerSrc = workerUrlMod.default;
      _pdfjsLib = pdfjsMod;
      return _pdfjsLib;
    })();
  }
  return _initPromise;
}

async function initPdfLib() {
  if (_PDFDocument) return _PDFDocument;
  const mod = await import('pdf-lib');
  _PDFDocument = mod.PDFDocument;
  return _PDFDocument;
}

const CMAP_URL = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@5.7.284/cmaps/';

export async function pdfToImages(pdfFile, imageType = 'image/png', scale = 1.5) {
  const pdfjsLib = await initPdfjs();
  const arrayBuffer = await pdfFile.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({
    data: arrayBuffer,
    cMapUrl: CMAP_URL,
    cMapPacked: true,
  });
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

function groupTextItemsByLine(items) {
  if (!items.length) return [];
  const tolerance = 2;
  const lines = [];
  let currentLine = [items[0]];
  let currentY = items[0].transform[5];
  for (let i = 1; i < items.length; i++) {
    const y = items[i].transform[5];
    if (Math.abs(y - currentY) < tolerance) {
      currentLine.push(items[i]);
    } else {
      lines.push(currentLine.sort((a, b) => a.transform[4] - b.transform[4]));
      currentLine = [items[i]];
      currentY = y;
    }
  }
  lines.push(currentLine.sort((a, b) => a.transform[4] - b.transform[4]));
  return lines;
}

export async function pdfToText(pdfFile) {
  const pdfjsLib = await initPdfjs();
  const arrayBuffer = await pdfFile.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({
    data: arrayBuffer,
    cMapUrl: CMAP_URL,
    cMapPacked: true,
  });
  const pdf = await loadingTask.promise;
  const pageTexts = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const lines = groupTextItemsByLine(textContent.items);
    pageTexts.push(lines.map(line => line.map(item => item.str).join('')).join('\n'));
  }
  return pageTexts.join('\n\n');
}

export async function pdfToHtml(pdfFile, scale = 2) {
  const imageBlobs = await pdfToImages(pdfFile, 'image/png', scale);
  const imagesBase64 = await Promise.all(imageBlobs.map(blobToBase64));
  const pagesHtml = imagesBase64.map((src, idx) => `
    <div class="pdf-page">
      <img src="${src}" alt="Page ${idx+1}" style="max-width:100%; height:auto; display:block;" />
      <p style="margin:8px 0 0; font-size:12px; color:#666;">Page ${idx+1} of ${imagesBase64.length}</p>
    </div>
  `).join('');

  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Converted PDF: ${escapeHtml(pdfFile.name)}</title>
<style>
  body { background: #f3f4f6; margin:0; padding:20px; font-family: system-ui; }
  .container { max-width: 1000px; margin:0 auto; }
  .pdf-page { background: white; margin-bottom: 24px; text-align: center; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
  .pdf-page img { width: 100%; height: auto; }
  .info-note {
    margin-top: 20px;
    padding: 12px;
    background: #e0f2fe;
    border-radius: 8px;
    text-align: center;
    font-size: 14px;
    color: #0369a1;
  }
</style>
</head>
<body><div class="container">
  ${pagesHtml}
  <div class="info-note">
    ⚡ This HTML file contains embedded images of your PDF pages.
    It works in any browser, even when opened locally (file://).
  </div>
</div></body>
</html>`;
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function escapeHtml(str) {
  return str.replace(/[&<>]/g, function(m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
}
