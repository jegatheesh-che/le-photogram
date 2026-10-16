import fs from 'fs';
import path from 'path';

// All image, brand, and video filenames in the repository
function findAssetPath(baseName, ext, isLegal = false) {
  const prefix = isLegal ? '../' : '';
  const possiblePaths = [
    `assets/images/${baseName}.${ext}`,
    `assets/brand/${baseName}.${ext}`,
    `assets/videos/${baseName}.${ext}`,
    `assets/fonts/${baseName}.${ext}`
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return prefix + p;
    }
  }

  // Fallback to images
  return `${prefix}assets/images/${baseName}.${ext}`;
}

function unhashUrl(url, isLegal = false) {
  // Matches /assets/name-HASH.ext or assets/name-HASH.ext
  return url.replace(/(?:\/|\.\.\/)?assets\/([a-zA-Z0-9_\-\.]+?)-[a-zA-Z0-9_\-]{8}\.([a-zA-Z0-9]+)/g, (match, baseName, ext) => {
    return findAssetPath(baseName, ext, isLegal);
  });
}

const rootFiles = [
  'index.html',
  'about.html',
  'portfolio.html',
  'services.html',
  'testimonials.html',
  'faq.html',
  'booking.html',
  'contact.html',
  'work.html'
];

const legalFiles = [
  'legal/privacy-policy.html',
  'legal/terms-conditions.html',
  'legal/cookie-policy.html'
];

const headThemeScript = `  <!-- Zero-Flicker Theme Initialization -->
  <script>
    (function() {
      try {
        var t = localStorage.getItem('theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', t);
      } catch (e) {
        document.documentElement.setAttribute('data-theme', 'light');
      }
    })();
  </script>`;

function getNavZoneRight() {
  return `      <!-- Zone 3: Actions & Mobile Navigation Trigger -->
      <div class="nav-zone-right">
        <button class="theme-toggle" id="theme-toggle" type="button" aria-label="Toggle theme" title="Toggle theme">
          <svg class="theme-icon theme-icon-moon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
          <svg class="theme-icon theme-icon-sun" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
        </button>
        <button class="mobile-menu-toggle" aria-label="Toggle navigation" aria-expanded="false">
          <span></span>
          <span></span>
        </button>
      </div>`;
}

function getMobileDrawer(isLegal = false) {
  const p = isLegal ? '../' : '';
  return `  <!-- Mobile Bottom-Sheet Navigation Modal (Matching Reference UI/UX) -->
  <div class="mobile-nav-drawer" id="mobile-nav-drawer" role="dialog" aria-modal="true" aria-label="Mobile Navigation Drawer">
    <div class="mobile-sheet-card">
      <div class="mobile-sheet-pill" aria-hidden="true"></div>
      <div class="mobile-sheet-profile">
        <img src="${p}assets/images/founder-portrait.jpg" alt="Violet Norman" class="mobile-profile-avatar">
        <div class="mobile-profile-details">
          <h4 class="mobile-profile-name">Violet Norman</h4>
          <p class="mobile-profile-email">atelier@lephotogram.com</p>
        </div>
        <button class="mobile-sheet-close-btn" aria-label="Close navigation">&times;</button>
      </div>
      <div class="mobile-sheet-divider" aria-hidden="true"></div>
      <nav class="mobile-sheet-nav" aria-label="Mobile Menu">
        <ul class="mobile-sheet-menu">
          <li>
            <a href="${p}index.html" class="mobile-menu-item">
              <svg class="mobile-menu-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              <span>Home</span>
            </a>
          </li>
          <li>
            <a href="${p}about.html" class="mobile-menu-item">
              <svg class="mobile-menu-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <span>About</span>
            </a>
          </li>
          <li>
            <a href="${p}portfolio.html" class="mobile-menu-item">
              <svg class="mobile-menu-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              <span>Portfolio</span>
            </a>
          </li>
          <li>
            <a href="${p}services.html" class="mobile-menu-item">
              <svg class="mobile-menu-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              <span>Services</span>
            </a>
          </li>
          <li>
            <a href="${p}testimonials.html" class="mobile-menu-item">
              <svg class="mobile-menu-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              <span>Testimonials</span>
            </a>
          </li>
          <li>
            <a href="${p}faq.html" class="mobile-menu-item">
              <svg class="mobile-menu-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <span>FAQ</span>
            </a>
          </li>
          <li>
            <a href="${p}booking.html" class="mobile-menu-item">
              <svg class="mobile-menu-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <span>Booking</span>
            </a>
          </li>
        </ul>
        <div class="mobile-sheet-divider" aria-hidden="true" style="margin: 10px 0 12px 0;"></div>
        <a href="${p}contact.html" class="mobile-menu-item mobile-menu-signout">
          <svg class="mobile-menu-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
            <polyline points="10 17 15 12 10 7"/>
            <line x1="15" y1="12" x2="3" y2="12"/>
          </svg>
          <span>Contact Studio</span>
        </a>
      </nav>
      <div class="mobile-home-indicator" aria-hidden="true"></div>
    </div>
  </div>`;
}

function processPage(file, isLegal = false) {
  const distPath = path.join('dist', file);
  if (!fs.existsSync(distPath)) {
    console.error(`Dist file missing: ${distPath}`);
    return;
  }

  let distHtml = fs.readFileSync(distPath, 'utf8');

  // Extract from </header> to end of file in distHtml
  const headerEndIdx = distHtml.indexOf('</header>');
  if (headerEndIdx === -1) {
    console.error(`No </header> in ${distPath}`);
    return;
  }

  // Find where <main starts in distHtml
  const mainIdx = distHtml.indexOf('<main');
  if (mainIdx === -1) {
    console.error(`No <main in ${distPath}`);
    return;
  }

  // Get the main + rest of the body from distHtml
  let mainAndBeyond = distHtml.substring(mainIdx);

  // Unhash asset URLs in mainAndBeyond
  mainAndBeyond = unhashUrl(mainAndBeyond, isLegal);

  // If dist has Vite script tags at end like <script type="module" src="/js/main.js"></script>
  // replace with bundle.js or main.js
  const scriptPrefix = isLegal ? '../' : '';
  mainAndBeyond = mainAndBeyond.replace(/<script[^>]*src="[^"]*\/assets\/index-[^"]*\.js"[^>]*><\/script>/g, `<script src="${scriptPrefix}js/bundle.js"></script>`);
  mainAndBeyond = mainAndBeyond.replace(/<script[^>]*src="[^"]*\/js\/main\.js"[^>]*><\/script>/g, `<script src="${scriptPrefix}js/bundle.js"></script>`);

  // Now construct the top part up to </header>
  // Read current source or distHtml
  let topPart = distHtml.substring(0, headerEndIdx);
  // Unhash any assets in top part (e.g. css/base.css, favicon, etc.)
  topPart = unhashUrl(topPart, isLegal);

  // Replace hashed CSS links with standard CSS links
  const cssPrefix = isLegal ? '../' : '';
  topPart = topPart.replace(/<link rel="stylesheet"[^>]*href="[^"]*\/assets\/pages-[^"]*\.css"[^>]*>/g, `  <link rel="stylesheet" href="${cssPrefix}css/base.css">\n  <link rel="stylesheet" href="${cssPrefix}css/components.css">\n  <link rel="stylesheet" href="${cssPrefix}css/pages.css">`);

  // Ensure zero-flicker script in <head>
  if (!topPart.includes('data-theme')) {
    topPart = topPart.replace(/(<meta\s+name=["']viewport["'][^>]*>)/i, `$1\n${headThemeScript}`);
  }

  // Update nav-zone-right in topPart
  topPart = topPart.replace(/(?:<!-- Zone 3:[^>]*-->\s*)?<div class="nav-zone-right">[\s\S]*?<\/div>/, getNavZoneRight());

  // Assemble full clean HTML
  const finalHtml = `${topPart}</header>\n\n${getMobileDrawer(isLegal)}\n\n  ${mainAndBeyond}`;

  fs.writeFileSync(file, finalHtml, 'utf8');
  console.log(`Reconstructed & updated: ${file}`);
}

console.log('Restoring and applying all pages cleanly...');
rootFiles.forEach(f => processPage(f, false));
legalFiles.forEach(f => processPage(f, true));
console.log('Finished successfully.');
