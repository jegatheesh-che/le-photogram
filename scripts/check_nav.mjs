import { createServer } from 'vite';
import { chromium } from 'playwright';

async function checkNav() {
  const server = await createServer({ server: { port: 5201 } });
  await server.listen();
  const baseUrl = `http://localhost:5201`;

  const browser = await chromium.launch();
  const page = await browser.newPage();

  for (const w of [890, 910, 960, 1024, 1100, 1200]) {
    await page.setViewportSize({ width: w, height: 768 });
    await page.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(200);

    const info = await page.evaluate(() => {
      const header = document.querySelector('.site-header');
      const logo = document.querySelector('.logo-wordmark-serif');
      const navCenter = document.querySelector('.nav-zone-center');
      const navLinks = document.querySelector('.nav-links');
      const toggle = document.querySelector('.mobile-menu-toggle');

      return {
        toggleVisible: toggle ? window.getComputedStyle(toggle).display : 'none',
        navCenterVisible: navCenter ? window.getComputedStyle(navCenter).display : 'none',
        logoRect: logo ? { left: logo.getBoundingClientRect().left, right: logo.getBoundingClientRect().right, width: logo.getBoundingClientRect().width } : null,
        navCenterRect: navCenter ? { left: navCenter.getBoundingClientRect().left, right: navCenter.getBoundingClientRect().right, width: navCenter.getBoundingClientRect().width } : null,
        navLinksHeight: navLinks ? navLinks.getBoundingClientRect().height : 0
      };
    });

    console.log(`Viewport ${w}px:`, info);
  }

  await browser.close();
  await server.close();
}

checkNav();
