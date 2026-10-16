import fs from 'fs';
import path from 'path';

// Complete dictionary of AI image replacements with authentic photography
const REPLACEMENTS = {
  // Mobile avatar
  'founder-portrait.jpg': '0DGXFfA98AkvUw7Cbmypov7C6I.png',

  // About page hero & story
  'about-hero-editorial.jpg': '5KfOzCUwYK2jacJ8iTfFycycvyk.png',
  'about-hero-botanical-bg.jpg': 'BLvK8NVj7sg4A7Z1rN3UBVdWTbA.png',
  'about-story-still-life.jpg': 'KBojH2xpWX2tjI39CDTdXsCFyPs.png',
  'about-team-shirt.jpg': '2a00718f470a52bd495c6756c10dffdb.jpg',

  // Team portraits
  'team-anna-stool.jpg': '6QETwDCscY2U361UOc7RpW3A8.png',
  'team-anna-brenner.jpg': '6QETwDCscY2U361UOc7RpW3A8.png',
  'team-noah-stool.jpg': '5FVxLPXl7bHRFIxltvQ6Ol5f5HA.png',
  'team-noah-bennett.jpg': '5FVxLPXl7bHRFIxltvQ6Ol5f5HA.png',
  'team-maya-stool.jpg': '2a00718f470a52bd495c6756c10dffdb.jpg',

  // Services page
  'services-hero-dining.jpg': 'HLJc5R8t7No4QbWnqQylHYnL0Ls.png',
  'services-meeting-artists.jpg': 'a544b86495d0ef5c81f479dc14d05517.jpg',
  'services-wood-texture.jpg': 'qKEv06WOCxODrJZMRTlLcY9o0.png',
  'services-chair-still-life.jpg': 'KBojH2xpWX2tjI39CDTdXsCFyPs.png',

  // Booking & Contact
  'booking-luxury-villa.jpg': 'P0Pj7ZojT4FHUirPwvLcH3VggWg.png',
  'contact-flowers-editorial.jpg': 'suieTU4VmBXixVaTwhoM7p9Q0WU.png',
  'contact-editorial-intimate.jpg': 'H4UtD50Ug1kmfBdrLv3yKEQNglw.png',
  'contact-modernist-villa.jpg': 'tlDNkFwtqh3IWPtxRxvhTOs74.png',

  // Portfolio
  'gallery-slideshow-allure.jpg': '5KfOzCUwYK2jacJ8iTfFycycvyk.png',
  'gallery-slideshow-poetry.jpg': '6QETwDCscY2U361UOc7RpW3A8.png',
  'portfolio-candid-bride-veil.jpg': '5KfOzCUwYK2jacJ8iTfFycycvyk.png',
  'portfolio-couple-couch.jpg': 'u7eF8zESaIQx3EYeRHv9ZD2JlqE.png',

  // Misc
  'luxury-pen.jpg': 'KBojH2xpWX2tjI39CDTdXsCFyPs.png',
  'luxury-pen.png': 'KBojH2xpWX2tjI39CDTdXsCFyPs.png',
  'golden-curtain-gradient.png': 'm8v8BYEEDPmgtoxEkQmh7RYt6g.png',
  'download.png': '0DGXFfA98AkvUw7Cbmypov7C6I.png'
};

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
let totalReplacements = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let modified = false;

  for (const [ai, authentic] of Object.entries(REPLACEMENTS)) {
    if (content.includes(ai)) {
      // Global replace
      const regex = new RegExp(ai.replace(/\./g, '\\.'), 'g');
      content = content.replace(regex, authentic);
      modified = true;
      totalReplacements++;
      console.log(`Replaced ${ai} -> ${authentic} in ${file}`);
    }
  }

  if (modified) {
    fs.writeFileSync(file, content, 'utf8');
  }
}

console.log(`\n=== ALL AI IMAGES SUCCESSFULLY REPLACED! Total replacements: ${totalReplacements} ===`);
