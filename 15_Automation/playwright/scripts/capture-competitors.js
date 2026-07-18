const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const competitors = [
  {
    name: 'Soda_Pop_Online',
    pages: [
      ['homepage', 'https://www.sodapoponline.com/'],
      [
        'subscription_collection',
        'https://www.sodapoponline.com/collections/soda-of-the-month-subscription'
      ],
      ['all_products', 'https://www.sodapoponline.com/collections/all']
    ]
  },
  {
    name: 'Grandpa_Joes',
    pages: [
      ['homepage', 'https://grandpajoescandyshop.com/'],
      [
        'glass_bottle_collection',
        'https://grandpajoescandyshop.com/product-tag/glass-bottle/'
      ]
    ]
  },
  {
    name: 'Liberty_Pantry',
    pages: [['homepage', 'https://libertypantry.com/']]
  },
  {
    name: 'Louisiana_Pantry',
    pages: [['homepage', 'https://louisianapantry.com/']]
  },
  {
    name: 'VAT19',
    pages: [['homepage', 'https://www.vat19.com/']]
  }
];

const screenshotRoot = path.resolve(
  __dirname,
  '..',
  '..',
  '..',
  '03_Competitors',
  'Screenshots'
);

function safeName(value) {
  return value
    .replace(/[^a-z0-9_-]/gi, '_')
    .replace(/_+/g, '_')
    .toLowerCase();
}

async function dismissCommonPopups(page) {
  const possibleButtons = [
    'button:has-text("Accept")',
    'button:has-text("Accept All")',
    'button:has-text("Allow all")',
    'button:has-text("Got it")',
    'button:has-text("No thanks")',
    'button:has-text("Close")',
    '[aria-label="Close"]'
  ];

  for (const selector of possibleButtons) {
    try {
      const button = page.locator(selector).first();
      if (await button.isVisible({ timeout: 750 })) {
        await button.click({ timeout: 1500 });
        await page.waitForTimeout(500);
      }
    } catch {
      // Ignore missing or unclickable popup controls.
    }
  }
}

async function loadLazyContent(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let distance = 0;
      const step = 700;

      const timer = setInterval(() => {
        window.scrollBy(0, step);
        distance += step;

        if (
          distance >= document.body.scrollHeight ||
          window.innerHeight + window.scrollY >= document.body.scrollHeight
        ) {
          clearInterval(timer);
          window.scrollTo(0, 0);
          resolve();
        }
      }, 150);
    });
  });

  await page.waitForTimeout(2000);
}

async function capture(page, competitor, label, url, deviceName) {
  const folder = path.join(screenshotRoot, competitor);
  fs.mkdirSync(folder, { recursive: true });

  const output = path.join(
    folder,
    `${safeName(label)}_${deviceName}.png`
  );

  console.log(`Opening ${competitor}: ${label} (${deviceName})`);

  try {
    await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 90000
    });

    await page.waitForTimeout(3000);
    await dismissCommonPopups(page);
    await loadLazyContent(page);

    await page.screenshot({
      path: output,
      fullPage: true
    });

    console.log(`Saved ${output}`);
  } catch (error) {
    console.error(`Failed ${url}: ${error.message}`);
  }
}

async function runDevice(browser, deviceName, viewport) {
  const context = await browser.newContext({
    viewport,
    userAgent:
      deviceName === 'mobile'
        ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1'
        : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130 Safari/537.36'
  });

  const page = await context.newPage();

  for (const competitor of competitors) {
    for (const [label, url] of competitor.pages) {
      await capture(page, competitor.name, label, url, deviceName);
    }
  }

  await context.close();
}

(async () => {
  fs.mkdirSync(screenshotRoot, { recursive: true });

  const browser = await chromium.launch({
    headless: true
  });

  await runDevice(browser, 'desktop', {
    width: 1440,
    height: 1000
  });

  await runDevice(browser, 'mobile', {
    width: 390,
    height: 844
  });

  await browser.close();

  console.log('\nDeep-dive screenshot capture complete.');
})();