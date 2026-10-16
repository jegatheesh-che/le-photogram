import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
        results = results.concat(walk(fullPath));
      }
    } else if (file.endsWith('.html') || file.endsWith('.css') || file.endsWith('.js')) {
      results.push(fullPath);
    }
  }
  return results;
}

const files = walk('.');
const referenced = new Map();

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const matches = content.matchAll(/(?:assets\/(?:images|brand)\/[a-zA-Z0-9_\-\.]+\.(?:png|jpg|jpeg|webp|svg))/g);
  for (const m of matches) {
    const img = m[0];
    if (!referenced.has(img)) referenced.set(img, []);
    referenced.get(img).push(file);
  }
}

console.log('=== REFERENCED IMAGES IN SITE (' + referenced.size + ' unique) ===');
for (const [img, refFiles] of Array.from(referenced.entries()).sort()) {
  console.log(`${img} -> used in ${refFiles.length} files (${refFiles.slice(0, 3).join(', ')})`);
}

// All files in assets/images
const allAssetsImages = fs.readdirSync('assets/images');
console.log('\n=== TOTAL ASSETS/IMAGES: ' + allAssetsImages.length + ' files ===');

// Check which assets/images are NOT currently used
const unused = allAssetsImages.filter(f => !referenced.has(`assets/images/${f}`));
console.log(`=== UNUSED ASSETS/IMAGES: ${unused.length} files ===`);
console.log(unused.slice(0, 30));
