// src/lib/image-tools.js
// 图像工具纯函数 —— 所有函数不操作 DOM，接收数据返回结果

// ===== 通用辅助 =====

export function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(2) + ' MB';
}

export function loadImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => resolve({ img, dataUrl: e.target.result });
      img.onerror = () => reject(new Error('Failed to load image.'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsDataURL(file);
  });
}

// ===== 1. 图像压缩 =====
export function compressImage(file, quality, maxWidth = null, outputFormat = null) {
  return new Promise(async (resolve, reject) => {
    try {
      const { img } = await loadImage(file);
      let width = img.width;
      let height = img.height;
      if (maxWidth && width > maxWidth) {
        height = Math.round(height * (maxWidth / width));
        width = maxWidth;
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      const format = outputFormat || file.type || 'image/jpeg';
      canvas.toBlob((blob) => {
        if (!blob) { reject(new Error('Compression failed.')); return; }
        const url = URL.createObjectURL(blob);
        resolve({
          blob, url,
          originalSize: file.size,
          compressedSize: blob.size,
          savedPercent: Math.round((1 - blob.size / file.size) * 100),
          width, height,
          originalWidth: img.width,
          originalHeight: img.height,
        });
      }, format, quality);
    } catch (e) { reject(e); }
  });
}

// ===== 2. 图像格式转换 =====
export function convertImageFormat(file, targetFormat, quality = 0.92, resizeWidth = null) {
  return new Promise(async (resolve, reject) => {
    try {
      const { img } = await loadImage(file);
      let width = img.width;
      let height = img.height;
      if (resizeWidth && width > resizeWidth) {
        height = Math.round(height * (resizeWidth / width));
        width = resizeWidth;
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (targetFormat === 'image/jpeg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
      }
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob((blob) => {
        if (!blob) { reject(new Error('Conversion failed.')); return; }
        const url = URL.createObjectURL(blob);
        resolve({
          blob, url,
          originalFormat: file.type,
          targetFormat,
          size: blob.size,
          width, height,
        });
      }, targetFormat, quality);
    } catch (e) { reject(e); }
  });
}

// ===== 3. 图像裁剪 & 尺寸调整 =====
export function cropImage(file, cropArea) {
  return new Promise(async (resolve, reject) => {
    try {
      const { img } = await loadImage(file);
      const { x, y, width, height } = cropArea;
      const sx = Math.round(x * img.width);
      const sy = Math.round(y * img.height);
      const sw = Math.round(width * img.width);
      const sh = Math.round(height * img.height);
      const canvas = document.createElement('canvas');
      canvas.width = sw;
      canvas.height = sh;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
      canvas.toBlob((blob) => {
        if (!blob) { reject(new Error('Crop failed.')); return; }
        const url = URL.createObjectURL(blob);
        resolve({ blob, url, width: sw, height: sh });
      }, file.type || 'image/png');
    } catch (e) { reject(e); }
  });
}

export function resizeImage(file, targetWidth, targetHeight, maintainAspect = true) {
  return new Promise(async (resolve, reject) => {
    try {
      const { img } = await loadImage(file);
      let w = targetWidth;
      let h = targetHeight;
      if (maintainAspect) {
        const ratio = Math.min(targetWidth / img.width, targetHeight / img.height);
        w = Math.round(img.width * ratio);
        h = Math.round(img.height * ratio);
      }
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      canvas.toBlob((blob) => {
        if (!blob) { reject(new Error('Resize failed.')); return; }
        const url = URL.createObjectURL(blob);
        resolve({
          blob, url,
          originalWidth: img.width, originalHeight: img.height,
          width: w, height: h, size: blob.size,
        });
      }, file.type || 'image/png');
    } catch (e) { reject(e); }
  });
}

export function rotateImage(file, degrees, outputFormat = null) {
  return new Promise(async (resolve, reject) => {
    try {
      const { img } = await loadImage(file);
      const rad = (degrees * Math.PI) / 180;
      const sin = Math.abs(Math.sin(rad));
      const cos = Math.abs(Math.cos(rad));
      const newW = Math.round(img.width * cos + img.height * sin);
      const newH = Math.round(img.width * sin + img.height * cos);
      const canvas = document.createElement('canvas');
      canvas.width = newW;
      canvas.height = newH;
      const ctx = canvas.getContext('2d');
      ctx.translate(newW / 2, newH / 2);
      ctx.rotate(rad);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      const format = outputFormat || file.type || 'image/png';
      canvas.toBlob((blob) => {
        if (!blob) { reject(new Error('Rotation failed.')); return; }
        const url = URL.createObjectURL(blob);
        resolve({ blob, url, width: newW, height: newH, size: blob.size });
      }, format);
    } catch (e) { reject(e); }
  });
}

export function flipImage(file, direction) {
  return new Promise(async (resolve, reject) => {
    try {
      const { img } = await loadImage(file);
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (direction === 'horizontal') {
        ctx.translate(img.width, 0);
        ctx.scale(-1, 1);
      } else {
        ctx.translate(0, img.height);
        ctx.scale(1, -1);
      }
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (!blob) { reject(new Error('Flip failed.')); return; }
        const url = URL.createObjectURL(blob);
        resolve({ blob, url, width: img.width, height: img.height, size: blob.size });
      }, file.type || 'image/png');
    } catch (e) { reject(e); }
  });
}

// ===== 4. MP4 to GIF (使用 gifenc 的正确 API) =====

async function extractVideoFramesForGif(videoFile, startTime, endTime, fps, maxWidth, onProgress) {
  console.log('[extract] Starting video frame extraction', { startTime, endTime, fps, maxWidth });
  const videoUrl = URL.createObjectURL(videoFile);
  const video = document.createElement('video');
  video.preload = 'auto';
  video.muted = true;
  video.playsInline = true;

  return new Promise((resolve, reject) => {
    const cleanup = () => URL.revokeObjectURL(videoUrl);
    let metaTimeout = setTimeout(() => {
      cleanup();
      reject(new Error('Timeout: failed to load video metadata'));
    }, 30000);

    video.onloadedmetadata = async () => {
      clearTimeout(metaTimeout);
      const duration = video.duration;
      console.log('[extract] Video duration', duration);
      if (!isFinite(duration) || duration <= 0) {
        cleanup();
        reject(new Error('Invalid video duration'));
        return;
      }
      const actualStart = Math.max(0, startTime);
      const actualEnd = Math.min(duration, endTime || duration);
      if (actualStart >= actualEnd) {
        cleanup();
        reject(new Error('Start time must be less than end time'));
        return;
      }
      const interval = 1 / fps;
      let frames = [];
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      let width = 0, height = 0;

      await new Promise(r => video.readyState >= 2 ? r() : (video.addEventListener('canplay', r, { once: true })));
      console.log('[extract] Video ready, starting frame extraction');

      const totalFrames = Math.floor((actualEnd - actualStart) / interval) + 1;
      for (let i = 0; i < totalFrames; i++) {
        const t = actualStart + i * interval;
        if (t > actualEnd) break;

        try {
          await new Promise((resolveSeek, rejectSeek) => {
            const seekTimeout = setTimeout(() => rejectSeek(new Error('seek timeout')), 10000);
            video.currentTime = t;
            const onSeeked = () => {
              clearTimeout(seekTimeout);
              video.removeEventListener('seeked', onSeeked);
              resolveSeek();
            };
            video.addEventListener('seeked', onSeeked);
          });
        } catch (err) {
          throw new Error(`Seek error at ${t}s: ${err.message}`);
        }

        let w = video.videoWidth, h = video.videoHeight;
        if (!w || !h) throw new Error('Cannot get video dimensions');
        if (maxWidth && w > maxWidth) {
          h = Math.round(h * (maxWidth / w));
          w = maxWidth;
        }
        if (width === 0) {
          width = w;
          height = h;
          canvas.width = width;
          canvas.height = height;
        }
        // 填充白色背景，再绘制视频帧（避免透明区域变黑）
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(video, 0, 0, width, height);
        const imageData = ctx.getImageData(0, 0, width, height);
        frames.push(imageData);

        if (onProgress) onProgress(i + 1, totalFrames);
      }
      cleanup();
      console.log('[extract] Extracted frames count', frames.length);
      resolve({ frames, duration: actualEnd - actualStart, width, height });
    };
    video.onerror = (e) => {
      clearTimeout(metaTimeout);
      cleanup();
      console.error('[extract] Video error', e);
      reject(new Error('Failed to load video'));
    };
    video.src = videoUrl;
  });
}

/**
 * 将 MP4 视频片段转换为 GIF（使用 gifenc）
 */
export async function createGifFromVideo(videoFile, startTime, endTime, fps, maxWidth, onProgress, quality = 10) {
  console.log('[gif] createGifFromVideo called');
  const { frames, duration, width, height } = await extractVideoFramesForGif(videoFile, startTime, endTime, fps, maxWidth, onProgress);
  console.log('[gif] Frames extracted', frames.length);
  if (frames.length === 0) throw new Error('No frames extracted.');

  // 动态导入 gifenc（仅此函数按需加载）
  let GIFEncoder, quantize;
  try {
    const gifenc = await import(/* @vite-ignore */ 'gifenc');
    GIFEncoder = gifenc.default;
    quantize = gifenc.quantize;
  } catch {
    throw new Error('GIF encoding library not available. Please ensure gifenc is installed.');
  }
  const palette = quantize(frames[0].data, 256);
  const gif = GIFEncoder();
  const delay = Math.round(1000 / fps);
  for (const imageData of frames) {
    gif.writeFrame(imageData.data, width, height, { palette, delay });
  }
  gif.finish();
  const gifData = gif.bytes();
  const blob = new Blob([gifData], { type: 'image/gif' });
  const url = URL.createObjectURL(blob);

  console.log('[gif] GIF generated, size', blob.size);
  return {
    blob,
    url,
    size: blob.size,
    frameCount: frames.length,
    duration,
    width,
    height,
  };
}