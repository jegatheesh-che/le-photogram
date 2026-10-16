import fs from 'fs';

const content = fs.readFileSync('portfolio.html', 'utf8');
const regex = /<img[^>]+src=["']assets\/images\/([^"']+)["'][^>]*>/g;
let match;
let count = 0;
const results = [];
while ((match = regex.exec(content)) !== null) {
  count++;
  const imgName = match[1];
  const exists = fs.existsSync('assets/images/' + imgName);
  results.push({ count, imgName, exists, line: content.substring(0, match.index).split('\n').length });
}

console.log(`Total image tags in portfolio.html: ${results.length}`);
results.forEach(r => {
  console.log(`${r.count}. Line ${r.line}: ${r.imgName} -> ${r.exists ? 'EXISTS' : '*** MISSING ***'}`);
});
