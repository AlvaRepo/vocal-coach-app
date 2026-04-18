import { test, expect } from '@playwright/test';

// En producción, Playwright suele recibir la BASE_URL por configuración o variable de entorno
const BASE_URL = process.env.PROD_URL || 'https://vocal-coach-admin.vercel.app';

test.describe('Dashboard E2E - Web/Production', () => {
  test('should load the dashboard in production', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // El header principal debería estar presente
    const header = page.getByRole('heading', { name: /Dashboard/i });
    await expect(header).toBeVisible();
  });

  test('should navigate to Students in production', async ({ page }) => {
    await page.goto(BASE_URL);
    const studentsLink = page.getByRole('link', { name: /Alumnos/i }).first();
    await studentsLink.click();
    
    await expect(page).toHaveURL(/.*students/);
  });
});
