import fs from 'fs';
import path from 'path';

const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
const imgDir = path.join('assets', 'images');
const missingByPage = {};
const existingByPage = {};

htmlFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const regex = /assets\/images\/([^"'()\s]+)/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const img = match[1];
    if (!fs.existsSync(path.join(imgDir, img))) {
      if (!missingByPage[file]) missingByPage[file] = [];
      if (!missingByPage[file].includes(img)) missingByPage[file].push(img);
    } else {
      if (!existingByPage[file]) existingByPage[file] = [];
      if (!existingByPage[file].includes(img)) existingByPage[file].push(img);
    }
  }
});

console.log('=== MISSING IMAGES PER PAGE ===');
console.log(JSON.stringify(missingByPage, null, 2));

console.log('\n=== EXISTING IMAGES PER PAGE ===');
console.log(JSON.stringify(existingByPage, null, 2));
