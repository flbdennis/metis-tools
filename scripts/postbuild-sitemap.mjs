import { readFileSync, writeFileSync, rmSync, existsSync } from 'fs';
import { join } from 'path';
import { cwd } from 'process';

const dist = join(cwd(), 'dist');
const indexFile = join(dist, 'sitemap-index.xml');
const dataFile = join(dist, 'sitemap-0.xml');

if (!existsSync(indexFile) || !existsSync(dataFile)) {
  process.exit(0);
}

// 读取 sitemap-0.xml 内容并写为 sitemap.xml
const xml = readFileSync(dataFile, 'utf-8');
writeFileSync(join(dist, 'sitemap.xml'), xml);

// 删除 sitemap-index.xml 和 sitemap-0.xml
rmSync(indexFile);
rmSync(dataFile);