import { test, expect } from '@playwright/test';

test.describe('Auth Common Usage & Error Handling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('debe permitir alternar entre Login y Registro sin perder el contexto visual', async ({ page }) => {
    const title = page.locator('h1');
    const toggleButton = page.getByRole('button', { name: /Registrate como administrador|¿Ya tenés cuenta\?/i });

    // Inicialmente en Login
    await expect(page.getByText(/Vocal Coach Admin/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Iniciar Sesión/i })).toBeVisible();

    // Cambiar a Registro
    await toggleButton.click();
    await expect(page.getByText(/Creá tu cuenta de administrador/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Registrarse/i })).toBeVisible();

    // Volver a Login
    await toggleButton.click();
    await expect(page.getByText(/Vocal Coach Admin/i)).toBeVisible();
  });

  test('debe mostrar errores de validación para campos vacíos', async ({ page }) => {
    // Intentar iniciar sesión sin datos
    await page.getByRole('button', { name: /Iniciar Sesión/i }).click();
    
    // El atributo 'required' del navegador debería activarse, 
    // pero si usamos validación personalizada, buscamos el mensaje.
    // Supabase suele devolver error si el mail es inválido.
    await page.getByLabel(/Email/i).fill('email-invalido');
    await page.getByLabel(/Contraseña/i).fill('1');
    await page.getByRole('button', { name: /Iniciar Sesión/i }).click();

    // Esperar a que Supabase devuelva un error (o la validación local)
    const errorAlert = page.locator('[role="alert"]');
    await expect(errorAlert).toBeVisible();
  });

  test('debe simular un registro exitoso (Mocking API)', async ({ page }) => {
    // Interceptamos la llamada a Supabase para evitar el rate limit en el test de UI
    await page.route('**/auth/v1/signup**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: { id: 'mock-user-id', email: 'nuevo-user@test.com' },
          session: null // Simulamos que requiere confirmación
        }),
      });
    });

    // Cambiar a registro
    await page.getByRole('button', { name: /Registrate como administrador/i }).click();
    
    await page.getByLabel(/Email Profesional/i).fill('nuevo-user@test.com');
    await page.getByLabel(/Contraseña/i).fill('password123');
    await page.getByRole('button', { name: /Registrarse/i }).click();

    // Verificar mensaje de éxito
    await expect(page.getByText(/Registro exitoso/i)).toBeVisible();
  });
});
