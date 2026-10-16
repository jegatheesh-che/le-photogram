import fs from 'fs';
import path from 'path';

// Let's inspect file sizes, extensions, and identify the sets of real assets
const files = fs.readdirSync('assets/images');

const md5Jpgs = [];
const framerPngs = [];
const namedJpgs = [];
const others = [];

for (const f of files) {
  const stat = fs.statSync(path.join('assets/images', f));
  const info = { name: f, size: stat.size, mtime: stat.mtime };
  if (/^[a-f0-9]{32}\.(jpg|png)$/i.test(f)) {
    md5Jpgs.push(info);
  } else if (/^[a-zA-Z0-9_-]{20,}\.(png|jpg)$/.test(f)) {
    framerPngs.push(info);
  } else if (/^[a-z0-9\-]+(\.jpg|\.png)$/.test(f)) {
    namedJpgs.push(info);
  } else {
    others.push(info);
  }
}

console.log(`MD5 Hashed images (original export): ${md5Jpgs.length}`);
console.log(`Framer CDN images (original export): ${framerPngs.length}`);
console.log(`Named images (likely AI generated or renamed): ${namedJpgs.length}`);
console.log(`Others: ${others.length}`);

console.log('\n--- NAMED IMAGES (Inspect for AI): ---');
namedJpgs.forEach(img => {
  console.log(`${img.name} (${(img.size / 1024).toFixed(1)} KB) - modified: ${img.mtime.toISOString()}`);
});

console.log('\n--- SAMPLE FRAMER CDN ASSETS: ---');
framerPngs.slice(0, 15).forEach(img => {
  console.log(`${img.name} (${(img.size / 1024).toFixed(1)} KB) - modified: ${img.mtime.toISOString()}`);
});

console.log('\n--- SAMPLE MD5 ASSETS: ---');
md5Jpgs.slice(0, 15).forEach(img => {
  console.log(`${img.name} (${(img.size / 1024).toFixed(1)} KB) - modified: ${img.mtime.toISOString()}`);
});
