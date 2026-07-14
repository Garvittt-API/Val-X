const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 800 } });
  
  // Mock the Tauri API
  await page.addInitScript(() => {
    window.__TAURI__ = {
      event: {
        listen: () => Promise.resolve(() => {})
      }
    };
  });
  
  await page.goto('http://localhost:4173');
  await page.waitForTimeout(2000);
  
  // Take screenshot of dashboard (default view - NoGame state)
  await page.screenshot({ path: 'screenshot-dashboard.png' });
  
  // Navigate to match view
  await page.click('button[title="Live Match"]');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'screenshot-match.png' });
  
  // Navigate to search
  await page.click('button[title="Player Search"]');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'screenshot-search.png' });
  
  // Navigate to history
  await page.click('button[title="Match History"]');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'screenshot-history.png' });
  
  // Navigate to overlay settings
  await page.click('button[title="Overlay"]');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'screenshot-overlay.png' });
  
  await browser.close();
  console.log('Screenshots saved!');
})();
