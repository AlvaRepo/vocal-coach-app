import { test, expect } from '@playwright/test';

// En producción, Playwright suele recibir la BASE_URL por configuración o variable de entorno
const BASE_URL = process.env.PROD_URL || 'https://vocal-coach-admin.vercel.app';

test.describe('Notes E2E - Web/Production', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('should create a new note successfully in production', async ({ page }) => {
    // 1. Navegar a la página de Notas
    const notesLink = page.getByRole('link', { name: /Notas/i });
    await notesLink.click();
    
    await expect(page).toHaveURL(/.*notes/);

    // 2. Abrir el modal
    await page.getByRole('button', { name: /Nueva Nota/i }).first().click();

    // 3. Completar el formulario
    const testTitle = `Prod Note ${Date.now()}`;
    const testContent = 'Validando persistencia en el entorno de producción.';
    
    await page.getByLabel(/Título/i).fill(testTitle);
    await page.getByLabel(/Contenido/i).fill(testContent);
    
    await page.getByLabel(/Tipo de Nota/i).click();
    await page.getByRole('option', { name: 'Rápida' }).click();

    // 4. Guardar
    await page.getByRole('button', { name: 'Crear Nota' }).click();

    // 5. Verificar
    const noteCard = page.locator('div').filter({ hasText: testTitle }).last();
    await expect(noteCard).toBeVisible();
  });
});
