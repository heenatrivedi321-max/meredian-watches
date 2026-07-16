const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('https://buckssauce.com/', { waitUntil: 'networkidle' });
  
  // Wait a bit for animations/WebGL to settle
  await page.waitForTimeout(5000);
  await page.screenshot({ path: 'bucks_top.png' });
  
  // Scroll down
  await page.evaluate(() => window.scrollBy(0, window.innerHeight));
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'bucks_mid.png' });
  
  await browser.close();
})();
