import { chromium } from 'playwright';

(async () => {
  const base = process.env.BASE_URL || 'http://localhost:3000';
  const browser = await chromium.launch();
  const page = await browser.newPage();
  try {
    console.log('Opening open-account page...');
    await page.goto(`${base}/open-account`, { waitUntil: 'domcontentloaded' });

    // Step 1: Personal - use form input order for robustness
    const personalInputs = page.locator('form input');
    await personalInputs.nth(0).fill('Test'); // first name
    await personalInputs.nth(1).fill('User'); // last name
    await personalInputs.nth(2).fill('testuser123'); // username
    await page.click('button:has-text("Next")');

    // Step 2: Contact
    // Step 2: Contact
    const contactInputs = page.locator('form input');
    await contactInputs.filter({ has: page.locator('input[type="email"]') }).first().fill('test.user+e2e@example.com');
    await contactInputs.nth(0).fill('test.user+e2e@example.com');
    await contactInputs.nth(1).fill('+1 555 555 5555');
    await page.selectOption('select[autoComplete="country"]', 'United States');
    await page.click('button:has-text("Next")');

    // Step 3: Account
    // Step 3: Account
    await page.selectOption('select[autoComplete="cc-csc"]', 'USD');
    // choose account type select (second select on the form)
    await page.selectOption('select', { index: 1, value: 'Checking' }).catch(() => {});
    const pinInput = page.locator('input[placeholder="4-digit PIN"], input[maxlength="4"]');
    await pinInput.first().fill('1234');
    await page.click('button:has-text("Next")');

    // Step 4: Security
    // Step 4: Security
    const securityInputs = page.locator('form input[type="password"]');
    await securityInputs.nth(0).fill('StrongP@ss1');
    await securityInputs.nth(1).fill('StrongP@ss1');
    await page.check('input[type="checkbox"]');

    // Submit
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 5000 }).catch(() => {}),
      page.click('button:has-text("Create Account")'),
    ]);

    console.log('E2E script completed. Check the app for expected behavior.');
  } catch (e) {
    console.error('E2E script failed:', e);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();
