import fs from 'fs';
import path from 'path';

const oldSvgPattern = `<svg class="mobile-menu-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
            <polyline points="10 17 15 12 10 7"/>
            <line x1="15" y1="12" x2="3" y2="12"/>
          </svg>`;

const newSvgPhone = `<svg class="mobile-menu-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>`;

function processFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf-8');
  if (content.includes(oldSvgPattern)) {
    content = content.replace(oldSvgPattern, newSvgPhone);
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated icon in ${filePath}`);
  } else {
    // Try regex in case of slight whitespace variance
    const regex = /<svg class="mobile-menu-icon"[^>]*>[\s\S]*?<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"[\s\S]*?<\/svg>/;
    if (regex.test(content)) {
      content = content.replace(regex, newSvgPhone);
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`Updated icon via regex in ${filePath}`);
    }
  }
}

const htmlFiles = [
  'index.html',
  'about.html',
  'portfolio.html',
  'services.html',
  'testimonials.html',
  'faq.html',
  'booking.html',
  'contact.html',
  'work.html',
  'legal/terms-conditions.html',
  'legal/privacy-policy.html',
  'legal/cookie-policy.html'
];

htmlFiles.forEach(f => processFile(path.resolve('d:/website-development-agency/le photogram paid', f)));
console.log('All files processed.');
