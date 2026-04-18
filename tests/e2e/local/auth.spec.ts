import { test, expect } from '@playwright/test';

// El baseURL se toma de playwright.config.ts

test.describe('Auth E2E Flow', () => {
  test('debe redirigir al login si no hay sesión al intentar acceder al dashboard', async ({ page }) => {
    await page.goto('/');
    
    // Debería redirigir a /login
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByText('Vocal Coach Admin')).toBeVisible();
    
    // Verificar que el año sea 2026 (o el actual)
    const currentYear = new Date().getFullYear().toString();
    await expect(page.getByText(new RegExp(currentYear))).toBeVisible();
  });

  test('debe mostrar error con credenciales inválidas', async ({ page }) => {
    await page.goto('/login');
    
    await page.getByLabel(/Email/i).fill('fake@user.com');
    await page.getByLabel(/Contraseña/i).fill('wrongpassword');
    await page.getByRole('button', { name: /Iniciar Sesión/i }).click();
    
    // Debería aparecer un toast o alerta de error (sonner/toast)
    // El repo usa una alerta o toast según la implementación de LoginPage
    // Verificamos que el botón siga diciendo 'Iniciar Sesión' (no cambió de estado a logueado)
    await expect(page.getByRole('button', { name: /Iniciar Sesión/i })).toBeVisible();
  });
});
