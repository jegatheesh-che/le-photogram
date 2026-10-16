import fs from 'fs';

// Let us find real assets from Framer CDN and MD5 collection
const files = fs.readdirSync('assets/images');

// Filter out all AI images
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

const realAssets = files.filter(f => !aiSet.has(f) && (f.endsWith('.png') || f.endsWith('.jpg')));
console.log('Real assets count:', realAssets.length);

// Let's print out the list of top high-res real assets
realAssets.forEach(f => {
  const stat = fs.statSync(`assets/images/${f}`);
  if (stat.size > 200 * 1024) { // > 200KB
    console.log(`${f} (${(stat.size/1024).toFixed(0)} KB)`);
  }
});
