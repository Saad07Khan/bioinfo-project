import sharp from 'sharp';
import { readFile, writeFile, stat, unlink } from 'node:fs/promises';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = resolve(__dirname, '..', 'public');

const jobs = [
  { src: 'rectangle.png', quality: 85 },
  { src: 'ddbj_logo.png', quality: 85 },
  { src: 'swissprot_logo.png', quality: 85 },
  { src: 'ncbi_logo.png', quality: 85 },
  { src: 'uniprot_logo.png', quality: 85 },
  { src: 'blue_pic.png', quality: 80, maxWidth: 1600 },
  { src: 'purple_pic.png', quality: 80, maxWidth: 1200 },
  { src: 'pink_pic.png', quality: 80, maxWidth: 1200 },
  { src: 'cyan2_pic.png', quality: 78, maxWidth: 1600 },
  { src: 'pic_grey.png', quality: 78, maxWidth: 1600 },
  { src: 'pic_cyan.png', quality: 78, maxWidth: 1600 },
  { src: 'card2_image.jpg', quality: 75, maxWidth: 1600, outName: 'card2_image.webp' },
  { src: 'PRP.jpg', quality: 78, maxWidth: 1600, outName: 'prp.webp' },
];

const deadAssets = ['iphone14.jpg', 'algo_bg.png', 'Background Web 2.jpg'];

async function fmt(bytes) {
  return bytes < 1024 ? `${bytes}B` : bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)}K` : `${(bytes / 1024 / 1024).toFixed(1)}M`;
}

for (const job of jobs) {
  const inPath = join(PUBLIC, job.src);
  const outName = job.outName ?? job.src.replace(/\.(png|jpg|jpeg)$/i, '.webp');
  const outPath = join(PUBLIC, outName);
  try {
    const beforeSize = (await stat(inPath)).size;
    let pipe = sharp(inPath);
    if (job.maxWidth) {
      const meta = await sharp(inPath).metadata();
      if (meta.width && meta.width > job.maxWidth) pipe = pipe.resize({ width: job.maxWidth });
    }
    const buf = await pipe.webp({ quality: job.quality, effort: 5 }).toBuffer();
    await writeFile(outPath, buf);
    const afterSize = buf.length;
    console.log(`OK  ${job.src} -> ${outName}  ${await fmt(beforeSize)} -> ${await fmt(afterSize)}`);
    if (outName !== job.src) {
      await unlink(inPath);
      console.log(`    removed ${job.src}`);
    }
  } catch (err) {
    console.error(`FAIL ${job.src}:`, err.message);
  }
}

for (const f of deadAssets) {
  try {
    const p = join(PUBLIC, f);
    const s = (await stat(p)).size;
    await unlink(p);
    console.log(`DEL ${f}  (${await fmt(s)} freed)`);
  } catch {
    console.log(`SKIP ${f} (not found)`);
  }
}
