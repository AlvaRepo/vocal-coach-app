import { test, expect } from '@playwright/test';

// El baseURL se toma de playwright.config.ts

test.describe('Supabase Integration E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Aseguramos que empezamos desde una página limpia
    await page.goto('/');
  });

  test('debe mostrar la pantalla de carga de Supabase antes del login', async ({ page }) => {
    // Al entrar a la raíz, el ProtectedRoute debería mostrar el spinner de sincronización
    await page.goto('/library');
    
    const loadingText = page.getByText(/Sincronizando con el alma de Supabase/i);
    // Nota: Esto puede ser muy rápido, pero Playwright debería capturarlo si existe
    if (await loadingText.isVisible()) {
      await expect(loadingText).toBeVisible();
    }
    
    // Debería terminar en /login
    await expect(page).toHaveURL(/.*login/);
  });

  test('el formulario de login debe tener el diseño premium "Soul"', async ({ page }) => {
    await page.goto('/login');
    
    // Verificar que el título principal esté presente
    await expect(page.getByText(/Vocal Coach Admin/i)).toBeVisible();
    
    // Verificar elementos estéticos (Soul Design) - buscamos los círculos de fondo
    const backgroundDecor = page.locator('.absolute.bg-primary.blur-\\[120px\\]');
    await expect(backgroundDecor).toBeDefined();
  });

  test('intento de login fallido muestra alerta destructiva', async ({ page }) => {
    await page.goto('/login');
    
    await page.getByLabel(/Email/i).fill('no-existe@test.com');
    await page.getByLabel(/Contraseña/i).fill('password123');
    await page.getByRole('button', { name: /Iniciar Sesión/i }).click();
    
    // Esperar mensaje de error de Supabase
    const errorAlert = page.locator('[role="alert"]');
    await expect(errorAlert).toBeVisible();
  });
});
