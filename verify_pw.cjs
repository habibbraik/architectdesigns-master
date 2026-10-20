const { chromium } = require('./node_modules/playwright');
const path = require('path');
const SNAP = 'C:/Users/kalai/AppData/Local/Temp/claude/d--Iscream/d53ea2b8-ccd4-4430-8da0-fcaa3e2a8d72/scratchpad';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 720 });

  const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 20000 });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: SNAP + '/s0_initial.png' });

  await page.evaluate(() => window.scrollTo({ top: window.innerHeight * 0.8 }));
  await page.waitForTimeout(3000);
  await page.screenshot({ path: SNAP + '/s1_20pct.png' });

  await page.evaluate(() => window.scrollTo({ top: window.innerHeight * 1.5 }));
  await page.waitForTimeout(3000);
  await page.screenshot({ path: SNAP + '/s2_40pct.png' });

  await page.evaluate(() => window.scrollTo({ top: window.innerHeight * 2.5 }));
  await page.waitForTimeout(3000);
  await page.screenshot({ path: SNAP + '/s3_70pct.png' });

  await page.evaluate(() => window.scrollTo({ top: window.innerHeight * 3.2 }));
  await page.waitForTimeout(3000);
  await page.screenshot({ path: SNAP + '/s4_90pct.png' });

  console.log('ERRORS:', JSON.stringify(errs));
  console.log('DONE');
  await browser.close();
})();
