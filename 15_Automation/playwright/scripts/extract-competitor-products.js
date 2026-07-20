const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const targets = [
  {
    competitor: 'Soda Pop Online',
    collectionUrls: [
      'https://www.sodapoponline.com/collections/soda-of-the-month-subscription',
      'https://www.sodapoponline.com/collections/all'
    ],
    maxPages: 20
  },
  {
    competitor: "Grandpa Joe's",
    collectionUrls: [
      'https://grandpajoescandyshop.com/product-tag/glass-bottle/'
    ],
    maxPages: 20
  }
];

const outputFile = path.resolve(
  __dirname,
  '..',
  '..',
  '..',
  '03_Competitors',
  'pricing_data',
  'competitor_products_detailed.csv'
);

const logFile = path.resolve(
  __dirname,
  '..',
  '..',
  '..',
  '03_Competitors',
  'pricing_data',
  'competitor_products_detailed_log.txt'
);

function log(message) {
  const line = `[${new Date().toISOString()}] ${message}`;
  console.log(line);
  fs.appendFileSync(logFile, `${line}\n`, 'utf8');
}

function csvEscape(value) {
  const text = String(value ?? '')
    .replace(/\r?\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return `"${text.replace(/"/g, '""')}"`;
}

function normalizeUrl(value) {
  try {
    const url = new URL(value);
    url.hash = '';
    return url.href;
  } catch {
    return '';
  }
}

function parsePrice(value) {
  const match = String(value ?? '').match(/\$?\s*(\d+(?:\.\d{1,2})?)/);

  if (!match) {
    return null;
  }

  const number = Number(match[1]);

  return Number.isFinite(number) ? number : null;
}

function detectBottleCount(text) {
  const normalized = String(text ?? '')
    .toLowerCase()
    .replace(/[–—]/g, '-');

  const patterns = [
    /\b(\d{1,3})\s*[- ]?pack\b/i,
    /\bpack\s+of\s+(\d{1,3})\b/i,
    /\bcase\s+of\s+(\d{1,3})\b/i,
    /\b(\d{1,3})\s*bottles?\b/i,
    /\b(\d{1,3})\s*count\b/i,
    /\bqty\.?\s*(\d{1,3})\b/i,
    /\bquantity\s*:?\s*(\d{1,3})\b/i
  ];

  for (const pattern of patterns) {
    const match = normalized.match(pattern);

    if (match) {
      const count = Number(match[1]);

      if (Number.isInteger(count) && count > 0 && count <= 144) {
        return count;
      }
    }
  }

  const singleBottleSignals = [
    /\bsingle bottle\b/i,
    /\bone bottle\b/i,
    /\b1 bottle\b/i,
    /\bindividual bottle\b/i
  ];

  if (singleBottleSignals.some((pattern) => pattern.test(normalized))) {
    return 1;
  }

  return null;
}

function classifyProduct(text, bottleCount, isSubscription) {
  const normalized = String(text ?? '').toLowerCase();

  if (isSubscription) {
    return 'subscription';
  }

  if (bottleCount === 1) {
    return 'single bottle';
  }

  if (bottleCount === 2) {
    return '2-pack';
  }

  if (bottleCount === 4) {
    return '4-pack';
  }

  if (bottleCount === 6) {
    return '6-pack';
  }

  if (bottleCount === 12) {
    return '12-pack';
  }

  if (bottleCount === 24) {
    return '24-pack';
  }

  if (bottleCount) {
    return `${bottleCount}-pack`;
  }

  if (/\bcase\b/i.test(normalized)) {
    return 'case - quantity unknown';
  }

  if (/\bvariety\b|\bassorted\b|\bsampler\b|\bmixed\b/i.test(normalized)) {
    return 'variety pack - quantity unknown';
  }

  return 'quantity unknown';
}

function detectSubscription(text, url) {
  const combined = `${text} ${url}`.toLowerCase();

  return (
    combined.includes('subscription') ||
    combined.includes('subscribe and save') ||
    combined.includes('subscribe & save') ||
    combined.includes('soda of the month') ||
    combined.includes('monthly delivery') ||
    combined.includes('every month')
  );
}

function detectSubscriptionFrequency(text) {
  const normalized = String(text ?? '').toLowerCase();

  if (/\bevery\s+month\b|\bmonthly\b/.test(normalized)) {
    return 'monthly';
  }

  if (/\bevery\s+2\s+months?\b|\bbimonthly\b/.test(normalized)) {
    return 'every 2 months';
  }

  if (/\bevery\s+3\s+months?\b|\bquarterly\b/.test(normalized)) {
    return 'every 3 months';
  }

  if (/\bweekly\b|\bevery\s+week\b/.test(normalized)) {
    return 'weekly';
  }

  return '';
}

function detectPurchaseType(text, isSubscription) {
  const normalized = String(text ?? '').toLowerCase();

  const hasOneTime =
    normalized.includes('one-time purchase') ||
    normalized.includes('one time purchase') ||
    normalized.includes('one-time payment');

  if (isSubscription && hasOneTime) {
    return 'subscription and one-time';
  }

  if (isSubscription) {
    return 'subscription';
  }

  return 'one-time';
}

function detectPrepaidTerm(text) {
  const normalized = String(text ?? '').toLowerCase();

  const matches = [];

  if (/\b3[- ]month\b|\bthree[- ]month\b/.test(normalized)) {
    matches.push('3 months');
  }

  if (/\b6[- ]month\b|\bsix[- ]month\b/.test(normalized)) {
    matches.push('6 months');
  }

  if (
    /\b12[- ]month\b|\btwelve[- ]month\b|\bone year\b|\b1 year\b/.test(
      normalized
    )
  ) {
    matches.push('12 months');
  }

  return matches.join('; ');
}

async function dismissCommonPopups(page) {
  const selectors = [
    'button:has-text("Accept")',
    'button:has-text("Accept All")',
    'button:has-text("Allow all")',
    'button:has-text("Got it")',
    'button:has-text("No thanks")',
    'button:has-text("Close")',
    '[aria-label="Close"]'
  ];

  for (const selector of selectors) {
    try {
      const element = page.locator(selector).first();

      if (await element.isVisible({ timeout: 500 })) {
        await element.click({ timeout: 1000 });
        await page.waitForTimeout(300);
      }
    } catch {
      // Ignore absent or unclickable popup controls.
    }
  }
}

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let previousHeight = 0;
      let unchangedCount = 0;

      const timer = setInterval(() => {
        window.scrollTo(0, document.body.scrollHeight);

        const currentHeight = document.body.scrollHeight;

        if (currentHeight === previousHeight) {
          unchangedCount += 1;
        } else {
          unchangedCount = 0;
          previousHeight = currentHeight;
        }

        if (unchangedCount >= 3) {
          clearInterval(timer);
          window.scrollTo(0, 0);
          resolve();
        }
      }, 750);
    });
  });

  await page.waitForTimeout(1000);
}

async function collectProductLinks(page) {
  const links = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a[href]'))
      .map((link) => ({
        href: link.href,
        text: (link.innerText || link.getAttribute('aria-label') || '').trim()
      }))
      .filter((item) => {
        const lower = item.href.toLowerCase();

        return (
          lower.includes('/products/') ||
          lower.includes('/product/')
        );
      });
  });

  return links
    .map((item) => normalizeUrl(item.href))
    .filter(Boolean);
}

async function findNextPageUrl(page) {
  return page.evaluate(() => {
    const directSelectors = [
      'a[rel="next"]',
      '.pagination a.next',
      '.pagination__next',
      'a.next',
      '.next.page-numbers'
    ];

    for (const selector of directSelectors) {
      const element = document.querySelector(selector);

      if (element?.href) {
        return element.href;
      }
    }

    const links = Array.from(document.querySelectorAll('a[href]'));

    const nextLink = links.find((link) => {
      const text = (
        link.innerText ||
        link.getAttribute('aria-label') ||
        ''
      )
        .trim()
        .toLowerCase();

      return (
        text === 'next' ||
        text === 'next page' ||
        text.includes('older products') ||
        text === '›' ||
        text === '→'
      );
    });

    return nextLink?.href || '';
  });
}

async function collectCollectionProductUrls(
  context,
  collectionUrl,
  maxPages
) {
  const page = await context.newPage();
  const productUrls = new Set();
  const visitedPages = new Set();

  let currentUrl = collectionUrl;
  let pageNumber = 1;

  try {
    while (
      currentUrl &&
      pageNumber <= maxPages &&
      !visitedPages.has(currentUrl)
    ) {
      visitedPages.add(currentUrl);

      log(`Collection page ${pageNumber}: ${currentUrl}`);

      await page.goto(currentUrl, {
        waitUntil: 'domcontentloaded',
        timeout: 90000
      });

      await page.waitForTimeout(2000);
      await dismissCommonPopups(page);
      await autoScroll(page);

      const links = await collectProductLinks(page);

      for (const link of links) {
        productUrls.add(link);
      }

      log(
        `Found ${links.length} product links; ${productUrls.size} unique total.`
      );

      let nextUrl = await findNextPageUrl(page);

      if (!nextUrl) {
        const generatedUrl = new URL(currentUrl);
        const currentPage = Number(
          generatedUrl.searchParams.get('page') || 1
        );

        generatedUrl.searchParams.set(
          'page',
          String(currentPage + 1)
        );

        const possibleNextUrl = generatedUrl.href;

        await page.goto(possibleNextUrl, {
          waitUntil: 'domcontentloaded',
          timeout: 90000
        });

        await page.waitForTimeout(1500);

        const nextLinks = await collectProductLinks(page);

        if (nextLinks.length === 0) {
          nextUrl = '';
        } else {
          const unseenLinks = nextLinks.filter(
            (link) => !productUrls.has(link)
          );

          nextUrl = unseenLinks.length > 0 ? possibleNextUrl : '';
        }
      }

      currentUrl = nextUrl;
      pageNumber += 1;
    }
  } finally {
    await page.close();
  }

  return Array.from(productUrls);
}

async function extractJsonLd(page) {
  return page.evaluate(() => {
    const scripts = Array.from(
      document.querySelectorAll('script[type="application/ld+json"]')
    );

    const parsed = [];

    for (const script of scripts) {
      try {
        parsed.push(JSON.parse(script.textContent));
      } catch {
        // Ignore malformed JSON-LD.
      }
    }

    const flatten = (value) => {
      if (Array.isArray(value)) {
        return value.flatMap(flatten);
      }

      if (value && typeof value === 'object') {
        const current = [value];

        if (Array.isArray(value['@graph'])) {
          current.push(...value['@graph'].flatMap(flatten));
        }

        return current;
      }

      return [];
    };

    return parsed.flatMap(flatten);
  });
}

function findProductJsonLd(items) {
  return items.find((item) => {
    const type = item?.['@type'];

    if (Array.isArray(type)) {
      return type.includes('Product');
    }

    return type === 'Product';
  });
}

function extractOfferPrices(productData) {
  const offers = productData?.offers;

  if (!offers) {
    return [];
  }

  const offerArray = Array.isArray(offers) ? offers : [offers];

  return offerArray
    .map((offer) => ({
      price:
        offer.price ??
        offer.lowPrice ??
        offer.highPrice ??
        '',
      currency: offer.priceCurrency ?? '',
      availability: offer.availability ?? '',
      offer_name: offer.name ?? ''
    }))
    .filter((offer) => offer.price !== '');
}

async function extractProductPage(page, competitor, productUrl) {
  await page.goto(productUrl, {
    waitUntil: 'domcontentloaded',
    timeout: 90000
  });

  await page.waitForTimeout(1500);
  await dismissCommonPopups(page);

  const pageData = await page.evaluate(() => {
    const bodyText = document.body?.innerText || '';

    const title =
      document.querySelector('h1')?.innerText?.trim() ||
      document.title ||
      '';

    const metaDescription =
      document
        .querySelector('meta[name="description"]')
        ?.getAttribute('content') || '';

    const selectedPrice =
      document.querySelector(
        '[data-product-price], .price-item--regular, .price-item, .product__price, .price, [class*="price"]'
      )?.innerText || '';

    const variantOptions = Array.from(
      document.querySelectorAll(
        'select option, input[type="radio"] + label, [role="radio"], .variant-input label'
      )
    )
      .map((element) => element.innerText?.trim() || element.value || '')
      .filter(Boolean);

    return {
      title,
      metaDescription,
      bodyText,
      selectedPrice,
      variantOptions
    };
  });

  const jsonLd = await extractJsonLd(page);
  const productJson = findProductJsonLd(jsonLd);
  const offers = extractOfferPrices(productJson);

  const combinedText = [
    pageData.title,
    pageData.metaDescription,
    pageData.bodyText,
    pageData.variantOptions.join(' '),
    productJson?.name || '',
    productJson?.description || '',
    offers.map((offer) => offer.offer_name).join(' ')
  ].join(' ');

  const bottleCount = detectBottleCount(combinedText);
  const isSubscription = detectSubscription(combinedText, productUrl);

  const visiblePrice = parsePrice(pageData.selectedPrice);
  const jsonPrice =
    offers.length > 0 ? parsePrice(offers[0].price) : null;

  const price = visiblePrice ?? jsonPrice;

  return {
    capture_date: new Date().toISOString(),
    competitor,
    product_name:
      pageData.title ||
      productJson?.name ||
      '',
    product_type: classifyProduct(
      combinedText,
      bottleCount,
      isSubscription
    ),
    bottle_count: bottleCount ?? '',
    total_price: price ?? '',
    price_per_bottle:
      price && bottleCount
        ? (price / bottleCount).toFixed(2)
        : '',
    purchase_type: detectPurchaseType(
      combinedText,
      isSubscription
    ),
    subscription_frequency: detectSubscriptionFrequency(
      combinedText
    ),
    prepaid_terms: detectPrepaidTerm(combinedText),
    variant_options: pageData.variantOptions.join('; '),
    currency:
      offers[0]?.currency ||
      'USD',
    availability: offers[0]?.availability || '',
    source_url: productUrl,
    notes:
      bottleCount === null
        ? 'Bottle count could not be determined automatically.'
        : ''
  };
}

(async () => {
  fs.mkdirSync(path.dirname(outputFile), {
    recursive: true
  });

  fs.writeFileSync(logFile, '', 'utf8');

  const browser = await chromium.launch({
    headless: true
  });

  const context = await browser.newContext({
    viewport: {
      width: 1440,
      height: 1000
    },
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
      'AppleWebKit/537.36 Chrome/130 Safari/537.36'
  });

  const rows = [];
  const processed = new Set();

  try {
    for (const target of targets) {
      const competitorUrls = new Set();

      for (const collectionUrl of target.collectionUrls) {
        try {
          const urls = await collectCollectionProductUrls(
            context,
            collectionUrl,
            target.maxPages
          );

          for (const url of urls) {
            competitorUrls.add(url);
          }
        } catch (error) {
          log(
            `Collection failed: ${collectionUrl}: ${error.message}`
          );
        }
      }

      log(
        `${target.competitor}: ${competitorUrls.size} unique product URLs queued.`
      );

      const page = await context.newPage();

      try {
        let count = 0;

        for (const productUrl of competitorUrls) {
          const key = `${target.competitor}|${productUrl}`;

          if (processed.has(key)) {
            continue;
          }

          processed.add(key);
          count += 1;

          log(
            `${target.competitor}: product ${count}/${competitorUrls.size}: ${productUrl}`
          );

          try {
            const row = await extractProductPage(
              page,
              target.competitor,
              productUrl
            );

            rows.push(row);
          } catch (error) {
            log(
              `Product failed: ${productUrl}: ${error.message}`
            );
          }

          await page.waitForTimeout(300);
        }
      } finally {
        await page.close();
      }
    }
  } finally {
    await context.close();
    await browser.close();
  }

  const header = [
    'capture_date',
    'competitor',
    'product_name',
    'product_type',
    'bottle_count',
    'total_price',
    'price_per_bottle',
    'purchase_type',
    'subscription_frequency',
    'prepaid_terms',
    'variant_options',
    'currency',
    'availability',
    'source_url',
    'notes'
  ];

  const csv = [
    header.join(','),
    ...rows.map((row) =>
      header
        .map((column) => csvEscape(row[column]))
        .join(',')
    )
  ].join('\n');

  fs.writeFileSync(outputFile, csv, 'utf8');

  log(`Saved ${rows.length} detailed product rows.`);
  log(`CSV: ${outputFile}`);
})();