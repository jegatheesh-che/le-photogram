import { createServer } from 'vite';
import { chromium } from 'playwright';

const SIZES = [
  { name: 'Mobile-320', width: 320, height: 600 },
  { name: 'Mobile-375', width: 375, height: 667 },
  { name: 'Mobile-414', width: 414, height: 896 },
  { name: 'Tab-Portrait-768', width: 768, height: 1024 },
  { name: 'Tab-Air-820', width: 820, height: 1180 },
  { name: 'Tab-Land-1024', width: 1024, height: 768 },
  { name: 'Laptop-1280', width: 1280, height: 800 },
  { name: 'Laptop-1366', width: 1366, height: 768 },
  { name: 'Desktop-1440', width: 1440, height: 900 },
  { name: 'Desktop-1920', width: 1920, height: 1080 }
];

const PAGES = [
  '/',
  '/about.html',
  '/portfolio.html',
  '/services.html',
  '/testimonials.html',
  '/faq.html',
  '/booking.html',
  '/contact.html',
  '/work.html'
];

async function run() {
  const server = await createServer({ server: { port: 5202 } });
  await server.listen();
  const baseUrl = `http://localhost:5202`;
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const results = [];

  for (const p of PAGES) {
    for (const s of SIZES) {
      await page.setViewportSize({ width: s.width, height: s.height });
      await page.goto(`${baseUrl}${p}`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(150);

      const check = await page.evaluate((vp) => {
        const issues = [];
        const winW = window.innerWidth;
        const winH = window.innerHeight;

        // 1. Horizontal overflow
        if (document.documentElement.scrollWidth > winW + 1) {
          issues.push({
            type: 'HORIZONTAL_OVERFLOW',
            docW: document.documentElement.scrollWidth,
            winW
          });
        }

        // 2. Text clipping or words overflowing viewport
        const headings = document.querySelectorAll('h1, h2, h3, .section-title, .logo-wordmark-serif');
        headings.forEach(h => {
          const r = h.getBoundingClientRect();
          if (r.width > winW - 20) {
            issues.push({
              type: 'HEADING_CROWDED',
              tag: h.tagName,
              text: h.textContent.trim().slice(0, 30),
              width: Math.round(r.width),
              winW
            });
          }
        });

        // 3. Multi-column grids squeezed too small (<180px per col)
        const grids = document.querySelectorAll('.grid, [class*="-grid"], [class*="-row"], [class*="-cards"]');
        grids.forEach(g => {
          const style = window.getComputedStyle(g);
          if (style.display === 'grid') {
            const cols = style.gridTemplateColumns.split(' ');
            if (cols.length > 1) {
              const firstColWidth = parseFloat(cols[0]);
              if (firstColWidth < 140 && winW < 900) {
                issues.push({
                  type: 'GRID_COLUMNS_TOO_NARROW',
                  className: g.className,
                  colCount: cols.length,
                  firstColW: Math.round(firstColWidth)
                });
              }
            }
          }
        });

        // 4. Form inputs overflowing or tiny touch targets
        const inputs = document.querySelectorAll('input, select, textarea, button.ref-submit-btn, button.btn');
        inputs.forEach(inp => {
          const r = inp.getBoundingClientRect();
          if (r.width > winW) {
            issues.push({
              type: 'INPUT_OVERFLOW',
              tag: inp.tagName,
              name: inp.name || inp.id || inp.className,
              width: Math.round(r.width)
            });
          }
          if (r.height > 0 && r.height < 36 && (inp.tagName === 'BUTTON' || inp.tagName === 'INPUT')) {
            issues.push({
              type: 'TOUCH_TARGET_TOO_SMALL',
              tag: inp.tagName,
              height: Math.round(r.height),
              text: inp.textContent.trim().slice(0, 20)
            });
          }
        });

        // 5. Header collisions
        const header = document.querySelector('.site-header');
        if (header) {
          const logo = header.querySelector('.site-logo');
          const navCenter = header.querySelector('.nav-zone-center');
          const toggle = header.querySelector('.mobile-menu-toggle');
          const isToggleShown = toggle && window.getComputedStyle(toggle).display !== 'none';
          const isNavCenterShown = navCenter && window.getComputedStyle(navCenter).display !== 'none';

          if (isNavCenterShown && logo) {
            const lRect = logo.getBoundingClientRect();
            const nRect = navCenter.getBoundingClientRect();
            const gap = nRect.left - lRect.right;
            if (gap < 12) {
              issues.push({
                type: 'HEADER_GAP_TOO_TIGHT',
                gap: Math.round(gap),
                winW
              });
            }
          }
        }

        return issues;
      }, s);

      if (check.length > 0) {
        results.push({ page: p, size: s.name, width: s.width, issues: check });
      }
    }
  }

  await browser.close();
  await server.close();

  console.log(`\nFound issues on ${results.length} page/size combinations:`);
  for (const r of results) {
    console.log(`\n[${r.page}] on ${r.size} (${r.width}px):`);
    for (const iss of r.issues) {
      console.log(`  - ${iss.type}:`, JSON.stringify(iss));
    }
  }
}

run();
