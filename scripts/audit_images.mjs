import fs from 'fs';
import path from 'path';

const imgDir = path.join('assets', 'images');
const files = fs.readdirSync(imgDir);
console.log('Total files in assets/images:', files.length);

const extCount = {};
files.forEach(f => {
  const ext = path.extname(f).toLowerCase();
  extCount[ext] = (extCount[ext] || 0) + 1;
});
console.log('Extensions:', JSON.stringify(extCount, null, 2));

const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
console.log('HTML files found:', htmlFiles.length, htmlFiles);

const usedImages = new Set();
const allImageRefs = [];
const pageUsage = {};
const missingImages = [];

htmlFiles.forEach(h => {
  const content = fs.readFileSync(h, 'utf8');
  const matches = content.match(/assets\/images\/[^"'()\s]+/g) || [];
  pageUsage[h] = { count: matches.length, images: matches.map(m => path.basename(m)) };
  matches.forEach(m => {
    const b = path.basename(m);
    usedImages.add(b);
    allImageRefs.push({ page: h, img: b });
    if (!fs.existsSync(path.join(imgDir, b))) {
      missingImages.push({ page: h, img: b });
    }
  });
});

console.log('Page usage summary:');
for (const [page, data] of Object.entries(pageUsage)) {
  console.log(`  ${page}: ${data.count} image references`);
}
console.log('Total unique images referenced in HTML:', usedImages.size);
console.log('Missing referenced images:', missingImages);

// Also check css files
const cssFiles = fs.readdirSync('css').filter(f => f.endsWith('.css'));
const cssUsed = new Set();
cssFiles.forEach(c => {
  const content = fs.readFileSync(path.join('css', c), 'utf8');
  const matches = content.match(/assets\/images\/[^"'()\s]+/g) || [];
  matches.forEach(m => cssUsed.add(path.basename(m)));
});
console.log('Unique images referenced in CSS:', cssUsed.size, Array.from(cssUsed));

// Categorize images in assets/images
const aiKeywords = ['generated', 'ai_', 'midjourney', 'dalle', 'sd_', 'flux'];
const aiFiles = files.filter(f => aiKeywords.some(kw => f.toLowerCase().includes(kw)));
console.log('Images matching AI keywords:', aiFiles.length, aiFiles);

const unusedFiles = files.filter(f => !usedImages.has(f) && !cssUsed.has(f));
console.log('Unused images in assets/images available:', unusedFiles.length);
