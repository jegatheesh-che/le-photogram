import fs from 'fs';

const cat = JSON.parse(fs.readFileSync('scripts/categorized_assets.json', 'utf8'));

console.log('=== REAL PORTRAIT ASSETS (Top 25) ===');
cat.portrait.slice(0, 25).forEach(img => {
  console.log(`${img.file} - ${img.width}x${img.height} (${img.ratio}) [${(img.size/1024).toFixed(0)} KB]`);
});

console.log('\n=== REAL SQUARE / BALANCED ASSETS (Top 20) ===');
cat.square.slice(0, 20).forEach(img => {
  console.log(`${img.file} - ${img.width}x${img.height} (${img.ratio}) [${(img.size/1024).toFixed(0)} KB]`);
});

console.log('\n=== REAL LANDSCAPE ASSETS (All 14) ===');
cat.landscape.forEach(img => {
  console.log(`${img.file} - ${img.width}x${img.height} (${img.ratio}) [${(img.size/1024).toFixed(0)} KB]`);
});
