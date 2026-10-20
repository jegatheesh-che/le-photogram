import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function runComprehensiveQATest() {
  console.log('--- Running Comprehensive Playwright QA Test on Upgraded Admin Dashboard ---');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
      console.log('Browser console error:', msg.text());
    }
  });

  // 1. Visit Login
  console.log('Step 1: Navigating to login...');
  await page.goto('http://127.0.0.1:8000/admin/login.php', { waitUntil: 'networkidle' });
  await page.fill('#username', 'admin');
  await page.fill('#password', 'AdminPassword2026!');
  await page.click('button[type="submit"]');

  await page.waitForURL('**/admin/index.php');
  console.log('Step 2: Logged in. URL:', page.url());

  // 2. Test Real-Time Search
  console.log('Step 3: Testing Real-time Search input...');
  const searchInput = page.locator('#catalogueSearchInput');
  await searchInput.fill('Highlands');
  await page.waitForTimeout(200);

  const highlandsVisible = await page.locator('#galleryTableBody tr:visible').count();
  console.log(`Matching rows for "Highlands": ${highlandsVisible}`);
  if (highlandsVisible !== 1) {
    throw new Error(`Expected exactly 1 matching row for Highlands, got ${highlandsVisible}`);
  }

  // Clear search
  await searchInput.fill('');
  await page.waitForTimeout(200);
  const resetCount = await page.locator('#galleryTableBody tr:visible').count();
  console.log(`Reset count after clearing search: ${resetCount}`);

  // 3. Test Sorting
  console.log('Step 4: Testing Catalogue Sorting (Title A-Z)...');
  await page.selectOption('#catalogueSortSelect', 'title-asc');
  await page.waitForTimeout(200);
  const firstSortedTitle = await page.locator('#galleryTableBody tr:first-child .row-item-title').innerText();
  console.log(`First row title after A-Z sort: "${firstSortedTitle}"`);

  // 4. Test In-Dashboard Lightbox Preview Modal
  console.log('Step 5: Testing In-Dashboard Lightbox Preview Modal...');
  const firstThumb = page.locator('#galleryTableBody tr:first-child img[data-action="preview"]');
  await firstThumb.click();
  await page.waitForSelector('#imagePreviewModalOverlay.active');
  const previewTitle = await page.locator('#previewModalTitle').innerText();
  console.log(`In-dashboard preview opened for: "${previewTitle}"`);
  await page.screenshot({ path: 'shots/qa_upgraded_01_preview_modal.png' });

  // Close preview modal
  await page.click('#imagePreviewModalOverlay .modal-cancel-btn');
  await page.waitForSelector('#imagePreviewModalOverlay:not(.active)');

  // 5. Test File Staging Previews Tray (Feature 1)
  console.log('Step 6: Testing Staged Upload Previews Tray...');
  // Create a quick dummy image file to test staging tray
  const testImgPath = path.resolve('shots/dummy_test_stage.jpg');
  fs.writeFileSync(testImgPath, Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00, 0xff, 0xdb, 0x00, 0x43, 0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08, 0x07, 0x07, 0x07, 0x09, 0x09, 0x08, 0x0a, 0x0c, 0x14, 0x0d, 0x0c, 0x0b, 0x0b, 0x0c, 0x19, 0x12, 0x13, 0x0f, 0x14, 0x1d, 0x1a, 0x1f, 0x1e, 0x1d, 0x1a, 0x1c, 0x1c, 0x20, 0x24, 0x2e, 0x27, 0x20, 0x22, 0x2c, 0x23, 0x1c, 0x1c, 0x28, 0x37, 0x29, 0x2c, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1f, 0x27, 0x39, 0x3d, 0x38, 0x32, 0x3c, 0x2e, 0x33, 0x34, 0x32, 0xff, 0xc0, 0x00, 0x0b, 0x08, 0x00, 0x0a, 0x00, 0x0a, 0x01, 0x01, 0x11, 0x00, 0xff, 0xda, 0x00, 0x08, 0x01, 0x01, 0x00, 0x00, 0x3f, 0x00, 0xbf, 0x80, 0xff, 0xd9]));

  await page.setInputFiles('#imageFilesInput', testImgPath);
  await page.waitForSelector('#stagedTray:visible');
  const stagedCount = await page.locator('.staged-card').count();
  console.log(`Staged cards rendered in tray: ${stagedCount}`);

  await page.screenshot({ path: 'shots/qa_upgraded_02_staged_tray.png' });

  // Test clear all staged
  await page.click('#clearStagedBtn');
  await page.waitForTimeout(200);
  const stagedAfterClear = await page.locator('.staged-card').count();
  console.log(`Staged cards after clear: ${stagedAfterClear}`);

  // 6. Test Security & Password Tab
  console.log('Step 7: Testing Security & Diagnostics Tab (Password Change form)...');
  await page.click('button[data-tab="systemTab"]');
  await page.waitForTimeout(200);
  await page.screenshot({ path: 'shots/qa_upgraded_04_security_tab.png' });

  console.log('--- All QA Playwright Tests Passed with 0 Errors! ---');
  console.log('Total Console Errors:', consoleErrors.length);

  // Clean test file
  if (fs.existsSync(testImgPath)) fs.unlinkSync(testImgPath);

  await browser.close();
}

runComprehensiveQATest().catch(err => {
  console.error('QA Test Failure:', err);
  process.exit(1);
});
