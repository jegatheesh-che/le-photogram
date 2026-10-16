import fs from 'fs';
import path from 'path';

function getJpgDimensions(buffer) {
  let offset = 2;
  while (offset < buffer.length) {
    if (buffer[offset] !== 0xFF) break;
    const marker = buffer[offset + 1];
    if (marker === 0xC0 || marker === 0xC2) {
      const height = buffer.readUInt16BE(offset + 5);
      const width = buffer.readUInt16BE(offset + 7);
      return { width, height };
    }
    const length = buffer.readUInt16BE(offset + 2);
    offset += 2 + length;
  }
  return null;
}

function getPngDimensions(buffer) {
  if (buffer.length >= 24 && buffer.toString('ascii', 1, 4) === 'PNG') {
    const width = buffer.readUInt32BE(16);
    const height = buffer.readUInt32BE(20);
    return { width, height };
  }
  return null;
}

function getImageDimensions(filePath) {
  const buffer = fs.readFileSync(filePath);
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.jpg' || ext === '.jpeg') return getJpgDimensions(buffer);
  if (ext === '.png') return getPngDimensions(buffer);
  return null;
}

const dir = path.join('assets', 'images');
const files = fs.readdirSync(dir);
const meta = [];

for (const file of files) {
  const p = path.join(dir, file);
  const dim = getImageDimensions(p);
  if (dim) {
    const ratio = (dim.width / dim.height);
    let orientation = 'square';
    if (ratio < 0.88) orientation = 'portrait';
    else if (ratio > 1.15) orientation = 'landscape';
    meta.push({ file, width: dim.width, height: dim.height, ratio: ratio.toFixed(2), orientation });
  } else {
    meta.push({ file, orientation: 'unknown' });
  }
}

console.log('Total analyzed:', meta.length);
const portraits = meta.filter(m => m.orientation === 'portrait');
const landscapes = meta.filter(m => m.orientation === 'landscape');
const squares = meta.filter(m => m.orientation === 'square');

console.log(`Portraits (vertical): ${portraits.length}`);
console.log(`Landscapes (horizontal): ${landscapes.length}`);
console.log(`Squares (balanced): ${squares.length}`);

fs.writeFileSync('scripts/image_inventory.json', JSON.stringify({ portraits, landscapes, squares }, null, 2));
console.log('Saved to scripts/image_inventory.json');
