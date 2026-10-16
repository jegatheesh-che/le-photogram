import fs from 'fs';
import path from 'path';

const cssPath = path.resolve('d:/website-development-agency/le photogram paid/css/pages.css');
let css = fs.readFileSync(cssPath, 'utf-8');

const replacements = [
  // High opacity harsh black smudges
  { from: /box-shadow:\s*0 35px 80px rgba\(0, 0, 0, 0\.55\);/g, to: 'box-shadow: var(--shadow-floating);' },
  { from: /box-shadow:\s*0 25px 80px rgba\(0, 0, 0, 0\.65\);/g, to: 'box-shadow: var(--shadow-floating);' },
  { from: /box-shadow:\s*0 10px 30px -5px rgba\(0, 0, 0, 0\.6\);/g, to: 'box-shadow: var(--shadow-ambient);' },
  { from: /box-shadow:\s*0 18px 42px -10px rgba\(0, 0, 0, 0\.22\);/g, to: 'box-shadow: var(--shadow-ambient);' },
  { from: /box-shadow:\s*0 18px 45px rgba\(0, 0, 0, 0\.16\);/g, to: 'box-shadow: var(--shadow-ambient);' },
  { from: /box-shadow:\s*0 24px 64px rgba\(20, 20, 20, 0\.22\);/g, to: 'box-shadow: var(--shadow-floating);' },
  { from: /box-shadow:\s*0 28px 80px rgba\(20, 20, 20, 0\.14\),\s*0 8px 24px rgba\(20, 20, 20, 0\.08\);/g, to: 'box-shadow: var(--shadow-floating);' },
  { from: /box-shadow:\s*0 16px 48px rgba\(20, 20, 20, 0\.18\),\s*0 4px 12px rgba\(20, 20, 20, 0\.1\);/g, to: 'box-shadow: var(--shadow-ambient);' },
  
  // Harsh bright red glow shadows
  { from: /box-shadow:\s*4px 4px 32px -8px rgba\(128, 10, 25, 0\.35\);/g, to: 'box-shadow: var(--shadow-crimson-glow);' },
  { from: /box-shadow:\s*0 6px 25px rgba\(193, 18, 31, 0\.45\);/g, to: 'box-shadow: var(--shadow-crimson-glow);' },
  { from: /box-shadow:\s*0 16px 40px -5px rgba\(193, 18, 31, 0\.5\),\s*0 0 25px rgba\(193, 18, 31, 0\.3\);/g, to: 'box-shadow: var(--shadow-crimson-glow);' },
  { from: /box-shadow:\s*0 12px 30px rgba\(128, 10, 25, 0\.28\);/g, to: 'box-shadow: var(--shadow-crimson-glow);' },

  // Heavy text shadows on video hero
  { from: /text-shadow:\s*0 2px 10px rgba\(0, 0, 0, 0\.7\);/g, to: 'text-shadow: 0 2px 16px rgba(0, 0, 0, 0.35);' },
  { from: /text-shadow:\s*0 4px 35px rgba\(0, 0, 0, 0\.7\);/g, to: 'text-shadow: 0 4px 25px rgba(0, 0, 0, 0.4);' },
  { from: /text-shadow:\s*0 2px 20px rgba\(0, 0, 0, 0\.6\);/g, to: 'text-shadow: 0 2px 16px rgba(0, 0, 0, 0.35);' }
];

let replacedCount = 0;
replacements.forEach(r => {
  const matches = css.match(r.from);
  if (matches) {
    replacedCount += matches.length;
    css = css.replace(r.from, r.to);
  }
});

fs.writeFileSync(cssPath, css, 'utf-8');
console.log(`Updated ${replacedCount} harsh shadows in ${cssPath}`);
