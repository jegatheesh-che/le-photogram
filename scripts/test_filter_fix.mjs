import { chromium } from 'playwright';

async function test() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://127.0.0.1:8000/portfolio.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // Click Weddings
  await page.click('button[data-filter="weddings"]');
  await page.waitForTimeout(500);
  const grid = page.locator('#portfolioBentoGrid');
  await grid.scrollIntoViewIfNeeded();
  await page.screenshot({ path: 'shots/filter_weddings_before.png' });

  // Test with display: none
  await page.addStyleTag({ content: '.portfolio-grid-item.filtered-out { display: none !important; }' });
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'shots/filter_weddings_display_none.png' });

  console.log('Saved screenshots: shots/filter_weddings_before.png and shots/filter_weddings_display_none.png');
  await browser.close();
}

test().catch(console.error);
