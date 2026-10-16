import fs from 'fs';

const content = fs.readFileSync('portfolio.html', 'utf8');
const regex = /<img[^>]+src=["']assets\/images\/([^"']+)["'][^>]*>/g;
const matches = [];
let m;
while ((m = regex.exec(content)) !== null) {
  matches.push(m[1]);
}
console.log('Total img tags in portfolio.html:', matches.length);
const counts = {};
matches.forEach(img => counts[img] = (counts[img] || 0) + 1);
const duplicates = Object.entries(counts).filter(([_, c]) => c > 1);
console.log('Duplicates in portfolio.html:', duplicates);
