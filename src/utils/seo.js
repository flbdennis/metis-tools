// src/utils/seo.js
import { seoData } from '../data/seo.js';

/**
 * 获取页面的 SEO 元数据
 * @param {string} pageKey - 对应 seoData 中的键，例如 'tools/bmi'
 * @returns {{ title: string, description: string }}
 */
export function getPageSeo(pageKey) {
  const defaultSeo = {
    title: 'MetisTools – Free Online Converters & Calculators',
    description: 'Free online tools: unit converters, calculators, PDF tools, image editors, and developer utilities. All in your browser, no signup required.',
  };
  const seo = seoData[pageKey];
  if (seo) {
    return { title: seo.title, description: seo.description };
  }
  console.warn(`SEO data not found for key: ${pageKey}, using default.`);
  return defaultSeo;
}