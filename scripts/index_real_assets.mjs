import fs from 'fs';
import path from 'path';

// Let's get all original Framer CDN assets and MD5 assets
const files = fs.readdirSync('assets/images');

const originalAssets = files.filter(f => {
  return /^[a-zA-Z0-9_-]{20,}\.(png|jpg)$/.test(f) || /^[a-f0-9]{32}\.(jpg|png)$/i.test(f);
});

console.log(`Found ${originalAssets.length} original authentic assets.`);

// Check image dimensions from headers
function getDimensions(filePath) {
  const fd = fs.openSync(filePath, 'r');
  const buffer = Buffer.alloc(32);
  fs.readSync(fd, buffer, 0, 32, 0);
  fs.closeSync(fd);

  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
    // PNG
    const width = buffer.readUInt32BE(16);
    const height = buffer.readUInt32BE(20);
    return { type: 'PNG', width, height, ratio: (width / height).toFixed(2) };
  } else if (buffer[0] === 0xFF && buffer[1] === 0xD8) {
    // JPEG - read SOF marker
    const stat = fs.statSync(filePath);
    const fullBuffer = fs.readFileSync(filePath);
    let offset = 2;
    while (offset < fullBuffer.length) {
      if (fullBuffer[offset] !== 0xFF) break;
      const marker = fullBuffer[offset + 1];
      if (marker === 0xC0 || marker === 0xC2) {
        const height = fullBuffer.readUInt16BE(offset + 5);
        const width = fullBuffer.readUInt16BE(offset + 7);
        return { type: 'JPG', width, height, ratio: (width / height).toFixed(2) };
      }
      const length = fullBuffer.readUInt16BE(offset + 2);
      offset += 2 + length;
    }
    return { type: 'JPG', width: 'unknown', height: 'unknown', ratio: 'unknown' };
  }
  return { type: 'unknown' };
}

const categorized = {
  portrait: [],   // ratio < 0.85
  square: [],     // 0.85 <= ratio <= 1.15
  landscape: [],  // ratio > 1.15
};

for (const file of originalAssets) {
  const fullPath = path.join('assets/images', file);
  const dim = getDimensions(fullPath);
  const size = fs.statSync(fullPath).size;
  const item = { file, ...dim, size };
  if (dim.ratio !== 'unknown') {
    const r = parseFloat(dim.ratio);
    if (r < 0.85) categorized.portrait.push(item);
    else if (r <= 1.15) categorized.square.push(item);
    else categorized.landscape.push(item);
  }
}

console.log(`Categorized:
- Portrait (vertical): ${categorized.portrait.length}
- Square / Balanced: ${categorized.square.length}
- Landscape (horizontal): ${categorized.landscape.length}`);

fs.writeFileSync('scripts/categorized_assets.json', JSON.stringify(categorized, null, 2));
console.log('Saved to scripts/categorized_assets.json');
