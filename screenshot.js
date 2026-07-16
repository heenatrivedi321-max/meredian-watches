import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 }
  });
  
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000); // Wait for WebGL to render
  
  await page.screenshot({ path: 'screenshot_top.jpg' });
  
  // Scroll down a bit
  await page.evaluate(() => window.scrollBy(0, 1080));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'screenshot_middle.jpg' });
  
  await browser.close();
})();
