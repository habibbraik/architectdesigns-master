import { chromium } from './node_modules/playwright/index.mjs';
import path from 'path';
import { fileURLToPath } from 'url';

const SCRATCHPAD = 'C:/Users/kalai/AppData/Local/Temp/claude/d--Iscream/d53ea2b8-ccd4-4430-8da0-fcaa3e2a8d72/scratchpad';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.setViewportSize({ width: 1280, height: 720 });

const errors = [];
page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
page.on('pageerror', err => errors.push(err.message));

await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);

await page.screenshot({ path: SCRATCHPAD + '/hero_initial.png' });

const h1 = await page.textContent('h1').catch(() => 'NOT FOUND');
console.log('H1:', h1);

const img = await page.$('img[alt="Premium Almond Chocobar"]');
console.log('Bar image:', !!img);
const canvas = await page.$('canvas');
console.log('Canvas:', !!canvas);

await page.evaluate(() => window.scrollTo({ top: window.innerHeight * 1.0 }));
await page.waitForTimeout(2500);
await page.screenshot({ path: SCRATCHPAD + '/hero_25pct.png' });

await page.evaluate(() => window.scrollTo({ top: window.innerHeight * 2.0 }));
await page.waitForTimeout(2500);
await page.screenshot({ path: SCRATCHPAD + '/hero_50pct.png' });

await page.evaluate(() => window.scrollTo({ top: window.innerHeight * 3.2 }));
await page.waitForTimeout(2500);
await page.screenshot({ path: SCRATCHPAD + '/hero_80pct.png' });

console.log('Errors:', JSON.stringify(errors));
await browser.close();
console.log('DONE');
