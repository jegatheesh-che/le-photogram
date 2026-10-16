import fs from 'fs';
import path from 'path';

const aiSet = new Set([
  'founder-portrait.jpg',
  'about-hero-botanical-bg.jpg',
  'about-hero-editorial.jpg',
  'about-story-still-life.jpg',
  'about-team-shirt.jpg',
  'booking-luxury-villa.jpg',
  'contact-editorial-intimate.jpg',
  'contact-flowers-editorial.jpg',
  'contact-modernist-villa.jpg',
  'gallery-slideshow-allure.jpg',
  'gallery-slideshow-poetry.jpg',
  'portfolio-candid-bride-veil.jpg',
  'portfolio-couple-couch.jpg',
  'services-chair-still-life.jpg',
  'services-hero-dining.jpg',
  'services-meeting-artists.jpg',
  'services-wood-texture.jpg',
  'team-anna-brenner.jpg',
  'team-anna-stool.jpg',
  'team-maya-stool.jpg',
  'team-noah-bennett.jpg',
  'team-noah-stool.jpg',
  'luxury-pen.jpg',
  'luxury-pen.png',
  'golden-curtain-gradient.png',
  'download.png'
]);

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
    } else if (file.endsWith('.html') || file.endsWith('.css') || file.endsWith('.js') || file.endsWith('.json')) {
      results.push(fullPath);
    }
  }
  return results;
}

const files = walk('.');
const foundAiUsages = [];

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  for (const ai of aiSet) {
    if (content.includes(ai)) {
      foundAiUsages.push({ file, ai });
    }
  }
}

console.log(`Found ${foundAiUsages.length} usages of AI images across the site:`);
foundAiUsages.forEach(u => console.log(`- ${u.file}: ${u.ai}`));
