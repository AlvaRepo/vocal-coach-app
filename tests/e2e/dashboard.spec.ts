import { test, expect } from '@playwright/test';

test.describe('Dashboard E2E', () => {
  test('should load the dashboard and show the main title', async ({ page }) => {
    // Vite runs on 5174
    await page.goto('http://localhost:5174');
    
    // Check for the main title or a key element
    // Based on my previous browser check, it has "Dashboard" as title or header
    const header = page.getByRole('heading', { name: /Dashboard/i });
    await expect(header).toBeVisible();
  });

  test('should navigate to the Students page', async ({ page }) => {
    await page.goto('http://localhost:5174');
    
    // Click on the Students link in sidebar or menu
    // Finding it by text "Alumnos" which is what I saw in StudentsListPage
    const studentsLink = page.getByRole('link', { name: /Alumnos/i }).first();
    await studentsLink.click();
    
    // Check if we are on the students page
    await expect(page).toHaveURL(/.*students/);
    const header = page.getByRole('heading', { name: 'Alumnos', exact: true });
    await expect(header).toBeVisible();
  });
});
