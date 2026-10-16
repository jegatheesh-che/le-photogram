import fs from 'fs';

const pages = [
  'index.html',
  'about.html',
  'portfolio.html',
  'services.html',
  'testimonials.html',
  'faq.html',
  'booking.html',
  'contact.html',
  'work.html',
  'legal/privacy-policy.html',
  'legal/terms-conditions.html',
  'legal/cookie-policy.html'
];

const cleanNavZoneRight = `      <!-- Zone 3: Mobile Navigation Trigger -->
      <div class="nav-zone-right">
        <button class="mobile-menu-toggle" aria-label="Toggle navigation" aria-expanded="false">
          <span></span>
          <span></span>
        </button>
      </div>`;

pages.forEach(file => {
  if (!fs.existsSync(file)) return;
  let html = fs.readFileSync(file, 'utf8');

  // 1. Remove zero-flicker theme script from <head>
  html = html.replace(/\s*<!-- Zero-Flicker Theme Initialization -->[\s\S]*?<\/script>/, '');

  // 2. Remove #theme-toggle from nav-zone-right
  const navRightRegex = /(?:<!-- Zone 3:[^>]*-->\s*)?<div class="nav-zone-right">[\s\S]*?<\/div>/;
  if (navRightRegex.test(html)) {
    html = html.replace(navRightRegex, cleanNavZoneRight);
  }

  // 3. Remove any data-theme attribute on html tag
  html = html.replace(/\s*data-theme=["'][^"']*["']/g, '');

  fs.writeFileSync(file, html, 'utf8');
  console.log(`Undid theme toggle from: ${file}`);
});

console.log('Successfully removed theme toggle from all pages.');
