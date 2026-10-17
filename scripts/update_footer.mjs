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
    } else if (file.endsWith('.html') && !file.includes('component.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

const files = walk('.');
let count = 0;

for (const file of files) {
  const isLegal = file.includes('legal');
  const p = isLegal ? '../' : '';
  const leg = isLegal ? './' : 'legal/';

  const footerHtml = `  <!-- Footer - Framer Evermore Reference Match -->
  <footer class="site-footer">
    <div class="container">
      <div class="footer-top">
        <div class="footer-brand">
          <a href="${p}index.html" class="footer-brand-title">LE PHOTOGRAM</a>
          <p class="footer-subtitle">Wedding Photo &amp; Film Studio.</p>
        </div>
        <div>
          <h4 class="footer-col-title">Explore</h4>
          <ul class="footer-links">
            <li><a href="${p}index.html">Home</a></li>
            <li><a href="${p}about.html">About</a></li>
            <li><a href="${p}portfolio.html">Works</a></li>
            <li><a href="${p}services.html">Services</a></li>
            <li><a href="${p}contact.html">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 class="footer-col-title">Legal</h4>
          <ul class="footer-links">
            <li><a href="${leg}privacy-policy.html">Privacy Policy</a></li>
            <li><a href="${leg}terms-conditions.html">Terms &amp; Conditions</a></li>
            <li><a href="${leg}cookie-policy.html">Cookie Policy</a></li>
          </ul>
        </div>
        <div>
          <h4 class="footer-col-title">Connect</h4>
          <ul class="footer-links">
            <li><a href="https://instagram.com" target="_blank" rel="noopener">Instagram</a></li>
            <li><a href="https://facebook.com" target="_blank" rel="noopener">Facebook</a></li>
            <li><a href="https://twitter.com" target="_blank" rel="noopener">X (Twitter)</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-middle-bar">
        <p class="footer-copyright">&copy; 2026 Le Photogram. All rights reserved.</p>
        <div class="footer-attribution">
          <span class="footer-attribution-item">
            <span class="footer-attribution-dot" aria-hidden="true"></span>
            Fine Art Wedding Atelier
          </span>
          <span class="footer-attribution-item">Design by Atelier Le Photogram</span>
        </div>
      </div>

      <div class="footer-viewfinder-box">
        <div class="footer-corner-bracket corner-tl" aria-hidden="true"></div>
        <div class="footer-corner-bracket corner-tr" aria-hidden="true"></div>
        <div class="footer-corner-bracket corner-bl" aria-hidden="true"></div>
        <div class="footer-corner-bracket corner-br" aria-hidden="true"></div>

        <a href="${p}index.html" class="footer-monumental-link" aria-label="Le Photogram - Return to Home">
          <svg viewBox="0 0 1300 175" class="footer-monumental-svg" preserveAspectRatio="xMidYMid meet" aria-label="Le Photogram">
            <defs>
              <linearGradient id="footerTextGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95" />
                <stop offset="55%" stop-color="#ffffff" stop-opacity="0.32" />
                <stop offset="88%" stop-color="#ffffff" stop-opacity="0.08" />
                <stop offset="100%" stop-color="#ffffff" stop-opacity="0.01" />
              </linearGradient>
            </defs>
            <text x="50%" y="66%" text-anchor="middle" dominant-baseline="middle" font-family="'Italiana', serif" font-size="142" letter-spacing="0.04em" fill="url(#footerTextGrad)">LE PHOTOGRAM</text>
          </svg>
        </a>
      </div>
    </div>
  </footer>`;

  let content = fs.readFileSync(file, 'utf8');
  const footerRegex = /<!-- Footer[\s\S]*?<\/footer>/;
  if (footerRegex.test(content)) {
    content = content.replace(footerRegex, footerHtml);
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated footer in: ${file}`);
    count++;
  }
}

console.log(`Total footers updated: ${count}`);
