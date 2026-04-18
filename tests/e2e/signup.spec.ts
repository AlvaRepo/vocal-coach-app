import { test, expect } from '@playwright/test';

test.describe('Flujo de Registro de Administrador', () => {
  test.beforeEach(async ({ page }) => {
    // Vamos al login que es donde vive el formulario
    await page.goto('/login');
  });

  test('debe permitir crear una cuenta exitosamente con datos válidos (Mocked)', async ({ page }) => {
    // Interceptamos la llamada a Supabase para que sea instantáneo y no dependa de internet
    await page.route('**/auth/v1/signup**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: { id: 'user-123', email: 'arquitecto@vocalcoach.io' },
          session: null // Simulamos que requiere confirmación por mail
        }),
      });
    });

    // 1. Cambiamos a la vista de "Registro"
    const toggleButton = page.getByRole('button', { name: /¿No tenés cuenta\? Registrate como administrador/i });
    await toggleButton.click();

    // 2. Verificamos que el título cambió (feedback visual)
    await expect(page.getByText(/Creá tu cuenta de administrador/i)).toBeVisible();

    // 3. Llenamos los campos
    // Usamos los labels exactos que tenés en el código
    await page.getByLabel(/Email Profesional/i).fill('arquitecto@vocalcoach.io');
    await page.getByLabel(/Contraseña/i).fill('PasswordSegura123!');

    // 4. Mandamos el formulario
    await page.getByRole('button', { name: /Registrarse/i }).click();

    // 5. Verificamos el mensaje de éxito que devuelve LoginPage.tsx
    await expect(page.getByText(/Registro exitoso/i)).toBeVisible();
  });
});
