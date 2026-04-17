import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5174';

test.describe('Notes E2E - Local', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('should create a new note successfully', async ({ page }) => {
    // 1. Navegar a la página de Notas
    const notesLink = page.getByRole('link', { name: /Notas/i });
    await notesLink.click();
    
    // Verificar que estamos en la página correcta
    await expect(page).toHaveURL(/.*notes/);
    await expect(page.getByRole('heading', { name: 'Notas', exact: true })).toBeVisible();

    // 2. Abrir el modal de nueva nota
    await page.getByRole('button', { name: /Nueva Nota/i }).first().click();

    // 3. Completar el formulario
    const testTitle = `Nota Test ${Date.now()}`;
    const testContent = 'Esta es una nota de prueba creada por Playwright para validar la integración con Supabase.';
    
    await page.getByLabel(/Título/i).fill(testTitle);
    await page.getByLabel(/Contenido/i).fill(testContent);
    
    // Seleccionar tipo de nota (Radix Select)
    await page.getByLabel(/Tipo de Nota/i).click();
    await page.getByRole('option', { name: 'Rápida' }).click();

    // 4. Guardar
    await page.getByRole('button', { name: 'Crear Nota' }).click();

    // 5. Verificar que la nota aparezca en la lista
    // Buscamos la tarjeta de la nota
    const noteCard = page.locator('div.rounded-xl').filter({ hasText: testTitle }).last();
    await expect(noteCard).toBeVisible();
    await expect(noteCard).toContainText(testContent);
  });
});
