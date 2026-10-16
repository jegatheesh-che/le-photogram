import fs from 'fs';

let errors = 0;
function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    errors++;
  } else {
    console.log(`✅ PASS: ${message}`);
  }
}

console.log('=== RUNNING VERIFICATION SUITE ===\n');

// 1. Check all HTML files
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

for (const p of pages) {
  const content = fs.readFileSync(p, 'utf8');
  assert(!content.includes('theme-toggle'), `${p} correctly DOES NOT have theme-toggle`);
  assert(!content.includes('Zero-Flicker Theme Initialization'), `${p} correctly DOES NOT have theme script`);
  assert(!content.includes('nav-utility-btn'), `${p} removed search icon from navigation`);
  assert(!content.includes('nav-action-link'), `${p} removed INQUIRE button from navigation`);
  assert(content.includes('mobile-sheet-card'), `${p} contains reference mobile bottom-sheet modal`);
  assert(content.includes('mobile-profile-avatar'), `${p} contains mobile profile avatar`);
  assert(content.includes('<main'), `${p} has main content tag`);
  assert(content.includes('</main>'), `${p} has closing main content tag`);
}

// 2. Check CSS definitions
const baseCss = fs.readFileSync('css/base.css', 'utf8');
assert(!baseCss.includes('[data-theme="dark"]'), 'base.css DOES NOT have [data-theme="dark"]');
assert(baseCss.includes('Cormorant Garamond'), 'base.css has Cormorant Garamond font-face');
assert(baseCss.includes('Instrument Sans'), 'base.css has Instrument Sans font-face');
assert(baseCss.includes('Italiana'), 'base.css has Italiana font-face');

const compCss = fs.readFileSync('css/components.css', 'utf8');
assert(!compCss.includes('.theme-toggle'), 'components.css DOES NOT have .theme-toggle');
assert(!compCss.includes('[data-theme="dark"]'), 'components.css DOES NOT have [data-theme="dark"]');
assert(compCss.includes('.mobile-sheet-card'), 'components.css defines .mobile-sheet-card styling');

const pagesCss = fs.readFileSync('css/pages.css', 'utf8');
assert(!pagesCss.includes('[data-theme="dark"]'), 'pages.css DOES NOT have [data-theme="dark"]');
assert(pagesCss.includes('.miros-icon-circle'), 'pages.css defines .miros-icon-circle');
assert(pagesCss.includes('background: #FFFFFF;'), 'pages.css .miros-icon-circle has white background');

// 3. Check JS
const mainJs = fs.readFileSync('js/main.js', 'utf8');
assert(!mainJs.includes('initTheme'), 'main.js DOES NOT import or call initTheme');

const bundleJs = fs.readFileSync('js/bundle.js', 'utf8');
assert(!bundleJs.includes('initTheme'), 'bundle.js DOES NOT contain initTheme');

console.log(`\n=== SUITE COMPLETE: ${errors === 0 ? 'ALL CHECKS PASSED!' : `${errors} ERRORS DETECTED`} ===`);
process.exit(errors === 0 ? 0 : 1);
