const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false
  });

  const page = await browser.newPage();

  await page.goto(
    'https://www.sodapoponline.com/collections/soda-of-the-month-subscription'
  );

  await page.waitForTimeout(10000);

  await page.screenshot({
    path: 'subscription_page.png',
    fullPage: true
  });

  console.log('Done!');

  await browser.close();
})();