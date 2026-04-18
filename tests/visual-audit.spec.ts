import { test, expect } from '@playwright/test';

test('visual audit of login page icons', async ({ page }) => {
  // Go to login page (webServer in config will handle starting the app)
  await page.goto('/login');
  
  // Wait for the main logo to be visible
  const logo = page.getByTestId('coro-black-logo');
  await expect(logo).toBeVisible();
  
  // Wait for decorative icons
  await expect(page.locator('svg').filter({ hasText: 'BLACK' })).toBeVisible();
  
  // Take a high-quality screenshot
  await page.screenshot({ 
    path: 'tests/login-preview.png', 
    fullPage: true,
    animations: 'allow' // We want to see the sheen/glow if possible in a frame
  });

  console.log('Screenshot saved to tests/login-preview.png');
});
