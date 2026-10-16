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
    } else if (file.endsWith('.html')) {
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

  const footerHtml = `  <!-- Footer -->
  <footer class="site-footer">
    <div class="container">
      <div class="footer-top">
        <div class="footer-brand">
          <img src="${p}assets/brand/full-logo-black.png" alt="Le PhotoGRAM" class="footer-logo-img">
          <p class="footer-subtitle">Fine Art Wedding Photography &amp; Films.</p>
          <p class="footer-locations">London &bull; Paris &bull; Lake Como &bull; New York</p>
          <a href="mailto:atelier@lephotogram.com" class="footer-email">atelier@lephotogram.com</a>
        </div>
        <div>
          <h4 class="footer-col-title">Navigation</h4>
          <ul class="footer-links">
            <li><a href="${p}index.html">Home</a></li>
            <li><a href="${p}about.html">About Us</a></li>
            <li><a href="${p}portfolio.html">Portfolio</a></li>
            <li><a href="${p}services.html">Collections</a></li>
          </ul>
        </div>
        <div>
          <h4 class="footer-col-title">Experience</h4>
          <ul class="footer-links">
            <li><a href="${p}testimonials.html">Client Reflections</a></li>
            <li><a href="${p}faq.html">Atelier FAQ</a></li>
            <li><a href="${p}booking.html">Reserve Date</a></li>
            <li><a href="${p}contact.html">Studio Inquiries</a></li>
          </ul>
        </div>
        <div>
          <h4 class="footer-col-title">Connect</h4>
          <ul class="footer-links">
            <li><a href="https://instagram.com" target="_blank" rel="noopener">Instagram</a></li>
            <li><a href="https://facebook.com" target="_blank" rel="noopener">Facebook</a></li>
            <li><a href="https://twitter.com" target="_blank" rel="noopener">X (Twitter)</a></li>
            <li><a href="https://wa.me/12125550192" target="_blank" rel="noopener">WhatsApp Direct</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2026 Le PhotoGRAM. All rights reserved.</p>
        <div class="footer-legal-inline">
          <a href="${leg}privacy-policy.html">Privacy Policy</a>
          <span>&bull;</span>
          <a href="${leg}terms-conditions.html">Terms &amp; Conditions</a>
          <span>&bull;</span>
          <a href="${leg}cookie-policy.html">Cookie Policy</a>
        </div>
        <a href="#top" class="footer-back-to-top">Back to top &uarr;</a>
      </div>
    </div>
  </footer>`;

  let content = fs.readFileSync(file, 'utf8');
  const footerRegex = /<!-- Footer -->[\s\S]*?<\/footer>/;
  if (footerRegex.test(content)) {
    content = content.replace(footerRegex, footerHtml);
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated footer in: ${file}`);
    count++;
  }
}

console.log(`Total footers updated: ${count}`);
