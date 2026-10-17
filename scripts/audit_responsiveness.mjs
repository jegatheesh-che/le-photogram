import { createServer } from 'vite';
import { chromium } from 'playwright';

const VIEWPORTS = [
  { name: 'Mobile XS (iPhone SE 1st gen)', width: 320, height: 568 },
  { name: 'Mobile S (Galaxy S8 / Android)', width: 360, height: 740 },
  { name: 'Mobile M (iPhone 12/13/14)', width: 390, height: 844 },
  { name: 'Mobile L (iPhone Pro Max)', width: 430, height: 932 },
  { name: 'Mobile Landscape', width: 844, height: 390 },
  { name: 'Tablet S (Foldable / Mini)', width: 600, height: 960 },
  { name: 'Tablet Portrait (iPad 768)', width: 768, height: 1024 },
  { name: 'Tablet Portrait (iPad Air 820)', width: 820, height: 1180 },
  { name: 'Tablet Landscape / Netbook (960)', width: 960, height: 600 },
  { name: 'Tablet Landscape (iPad 1024)', width: 1024, height: 768 },
  { name: 'Laptop Small (1280)', width: 1280, height: 800 },
  { name: 'Desktop Standard (1440)', width: 1440, height: 900 },
  { name: 'Desktop Full HD (1920)', width: 1920, height: 1080 },
  { name: 'Desktop QHD / Wide (2560)', width: 2560, height: 1440 }
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

async function runAudit() {
  console.log('Starting Vite server for audit...');
  const server = await createServer({
    server: { port: 5199 }
  });
  await server.listen();
  const address = server.httpServer.address();
  const baseUrl = `http://localhost:${address.port}`;
  console.log(`Vite server running at ${baseUrl}`);

  const browser = await chromium.launch();
  const page = await browser.newPage();

  const issues = [];

  for (const pagePath of PAGES) {
    const url = `${baseUrl}${pagePath}`;
    console.log(`\nAuditing page: ${pagePath}`);

    for (const vp of VIEWPORTS) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(300); // Allow animations & layout to settle

      // 1. Check for horizontal overflow
      const overflowData = await page.evaluate((vpWidth) => {
        const docWidth = document.documentElement.scrollWidth;
        const bodyWidth = document.body.scrollWidth;
        const winWidth = window.innerWidth;
        const hasOverflow = docWidth > winWidth + 1 || bodyWidth > winWidth + 1;

        const overflowingElements = [];
        if (hasOverflow) {
          const all = document.querySelectorAll('*');
          for (const el of all) {
            const rect = el.getBoundingClientRect();
            if (rect.right > winWidth + 2) {
              const tag = el.tagName.toLowerCase();
              const cls = el.className && typeof el.className === 'string' ? `.${el.className.trim().split(/\s+/).join('.')}` : '';
              const id = el.id ? `#${el.id}` : '';
              overflowingElements.push({
                selector: `${tag}${id}${cls}`,
                right: Math.round(rect.right),
                width: Math.round(rect.width),
                overflowAmount: Math.round(rect.right - winWidth)
              });
            }
          }
        }

        // Check header nav collision
        const header = document.querySelector('.site-header');
        let navCollision = false;
        let navDetails = null;
        if (header) {
          const logo = header.querySelector('.site-logo');
          const navCenter = header.querySelector('.nav-zone-center');
          const toggle = header.querySelector('.mobile-menu-toggle');
          if (logo && navCenter && window.getComputedStyle(navCenter).display !== 'none') {
            const logoRect = logo.getBoundingClientRect();
            const navRect = navCenter.getBoundingClientRect();
            if (logoRect.right > navRect.left) {
              navCollision = true;
              navDetails = `Logo (right: ${Math.round(logoRect.right)}) overlaps Nav (left: ${Math.round(navRect.left)})`;
            }
          }
        }

        return {
          winWidth,
          docWidth,
          bodyWidth,
          hasOverflow,
          overflowingElements: overflowingElements.slice(0, 5), // top 5
          navCollision,
          navDetails
        };
      }, vp.width);

      if (overflowData.hasOverflow) {
        issues.push({
          page: pagePath,
          viewport: vp.name,
          width: vp.width,
          type: 'HORIZONTAL_OVERFLOW',
          details: `Doc scrollWidth (${overflowData.docWidth}px) > Window innerWidth (${overflowData.winWidth}px)`,
          elements: overflowData.overflowingElements
        });
        console.log(`  ❌ [${vp.name} (${vp.width}px)] Horizontal Overflow! Doc width: ${overflowData.docWidth}px (Window: ${overflowData.winWidth}px)`);
        for (const el of overflowData.overflowingElements) {
          console.log(`     -> Element: ${el.selector} (right: ${el.right}px, overflow: +${el.overflowAmount}px)`);
        }
      }

      if (overflowData.navCollision) {
        issues.push({
          page: pagePath,
          viewport: vp.name,
          width: vp.width,
          type: 'NAV_COLLISION',
          details: overflowData.navDetails
        });
        console.log(`  ⚠️ [${vp.name} (${vp.width}px)] Nav Collision: ${overflowData.navDetails}`);
      }
    }
  }

  await browser.close();
  await server.close();

  console.log('\n========================================');
  console.log(`AUDIT SUMMARY: ${issues.length} potential responsive issues identified.`);
  console.log('========================================');
  for (const iss of issues) {
    console.log(`[${iss.page}] @ ${iss.viewport} (${iss.width}px): ${iss.type} - ${iss.details}`);
  }
}

runAudit().catch(err => {
  console.error('Audit failed with error:', err);
  process.exit(1);
});
