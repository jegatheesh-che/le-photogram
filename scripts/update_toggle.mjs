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
    } else if (file.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

const files = walk('.');
let updated = 0;
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  const re = /(<button class="mobile-menu-toggle"[^>]*>)\s*<span><\/span>\s*<span><\/span>\s*(<\/button>)/g;
  if (re.test(content)) {
    content = content.replace(re, '$1\n          <span></span>\n          <span></span>\n          <span></span>\n        $2');
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated toggle in: ' + file);
    updated++;
  }
}
console.log(`Total updated: ${updated}`);
