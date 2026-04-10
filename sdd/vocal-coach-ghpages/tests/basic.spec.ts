import { test, expect } from '@playwright/test';

const baseURL = process.env.TEST_BASE_URL ?? 'http://localhost:5174';

test('root loads and root div exists', async ({ page }) => {
  await page.goto(`${baseURL}/`);
  // Ensure React root element is mounted
  const root = page.locator('#root');
  await root.waitFor({ state: 'visible', timeout: 5000 });
  await expect(root).toBeVisible();
  // Basic sanity: title contains Vocal Coach
  await expect(await page.title()).toContain('Vocal');
});

test('assets are loaded (index-*.js)', async ({ page }) => {
  await page.goto(`${baseURL}/`);
  const scripts = page.locator('script[src*="index-"]');
  const count = await scripts.count();
  expect(count).toBeGreaterThan(0);
});
