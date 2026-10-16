import fs from 'fs';
import path from 'path';

const imgDir = path.join('assets', 'images');
const allAssets = fs.readdirSync(imgDir);

const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
const siteUsage = {};
const allUsed = new Set();
let totalSlots = 0;

htmlFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const regex = /assets\/images\/([^"'()\s]+)/g;
  let match;
  siteUsage[file] = [];
  while ((match = regex.exec(content)) !== null) {
    siteUsage[file].push(match[1]);
    allUsed.add(match[1]);
    totalSlots++;
  }
});

console.log('=== ASSET FOLDER INVENTORY ===');
console.log('Total files in assets/images:', allAssets.length);
const photos = allAssets.filter(f => !['luxury-pen.jpg', 'luxury-pen.png', 'golden-curtain-gradient.png', 'download.png'].includes(f));
console.log('Total authentic photographs available:', photos.length);

const inv = JSON.parse(fs.readFileSync('scripts/image_inventory.json', 'utf8'));
console.log(`- Vertical / Portraits (3:4, 4:5): ${inv.portraits.length}`);
console.log(`- Horizontal / Landscapes (16:9, 3:2): ${inv.landscapes.length}`);
console.log(`- Balanced / Squares (1:1): ${inv.squares.length}`);

console.log('\n=== SITE IMAGE SLOTS BY PAGE ===');
for (const [page, list] of Object.entries(siteUsage)) {
  const unique = new Set(list);
  console.log(`- ${page.padEnd(18)}: ${list.length} slots (${unique.size} unique)`);
}
console.log(`Total image display slots across entire website: ${totalSlots}`);
console.log(`Total unique photographs utilized: ${allUsed.size}`);
console.log(`Surplus authentic photographs available in reserve: ${photos.length - allUsed.size}`);

// Verify zero broken files
let broken = 0;
for (const img of allUsed) {
  if (!fs.existsSync(path.join(imgDir, img))) {
    console.error(`ERROR: Missing file ${img}`);
    broken++;
  }
}
console.log(`Total broken or missing images: ${broken}`);
