import fs from 'fs';
import path from 'path';

const files = fs.readdirSync('assets/images');

// Filter to authentic files (Framer CDN & MD5 jpgs)
const authentic = files.filter(f => {
  return /^[a-zA-Z0-9_-]{20,}\.(png|jpg)$/.test(f) || /^[a-f0-9]{32}\.(jpg|png)$/i.test(f);
});

// Identified AI images to exclude
const aiImages = [
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
];

console.log('Total authentic photography files in assets/images:', authentic.length);
console.log('AI-generated files identified:', aiImages.length);

// Let us find the best authentic replacements for every AI image!
// What are the roles of AI images currently on the site?
// 1. Mobile menu profile avatar (was founder-portrait.jpg) -> needs a real editorial portrait (e.g. bride portrait, photographer, artist)
// 2. About page hero portrait (was about-hero-editorial.jpg) -> needs a real stunning portrait from assets
// 3. About page hero background (was about-hero-botanical-bg.jpg)
// 4. About page story still life (was about-story-still-life.jpg)
// 5. About page Team:
//    - Anna Brenner primary (was team-anna-stool.jpg) & secondary (was about-story-still-life.jpg)
//    - Noah Bennett primary (was team-noah-stool.jpg) & secondary (was about-hero-editorial.jpg)
//    - Maya Clarke primary (was team-maya-stool.jpg) & secondary (was about-story-still-life.jpg)
// 6. Services page:
//    - The Master Hybrid overlap photo (was services-meeting-artists.jpg)
//    - The Signature Photography overlap photo (was services-wood-texture.jpg)
//    - The Cinematic Film (services.html was using text only or need photo)
// 7. Contact page:
//    - Arch photo / right visual (was contact-flowers-editorial.jpg)
// 8. Booking page:
//    - Left split visual / villa (was booking-luxury-villa.jpg)
// 9. Portfolio page:
//    - Allure slider slide 1 (was gallery-slideshow-allure.jpg)
//    - Allure slider slide 2 (was gallery-slideshow-poetry.jpg)
//    - Allure slider slide 3 (was about-hero-editorial.jpg)
//    - Mosaic grid items that used AI images:
//      - gallery-slideshow-allure.jpg
//      - services-hero-dining.jpg
//      - team-anna-stool.jpg
//      - portfolio-candid-bride-veil.jpg
//      - contact-editorial-intimate.jpg
//      - services-meeting-artists.jpg
//      - about-hero-botanical-bg.jpg
//      - team-noah-stool.jpg
//      - booking-luxury-villa.jpg
//      - contact-flowers-editorial.jpg
//      - gallery-slideshow-poetry.jpg
//      - contact-modernist-villa.jpg
//      - team-maya-stool.jpg
//      - services-chair-still-life.jpg
//      - founder-portrait.jpg
//      - about-story-still-life.jpg
// 10. Home page:
//     - How we work item 2 data-img (was portfolio-candid-bride-veil.jpg)
