# Tasks: Supabase Final Integration (Auth + Storage)

## Phase 1: Foundation (Auth & Storage Infrastructure)
- [x] 1.1 Crear `src/shared/stores/auth-store.ts` para manejar sesión y login.
- [x] 1.2 Crear `src/shared/api/storage-service.ts` para uploads a Supabase.
- [x] 1.3 Crear `src/shared/components/auth/ProtectedRoute.tsx` wrapper.

## Phase 2: Auth Implementation
- [x] 2.1 Crear `src/features/auth/pages/LoginPage.tsx` con diseño Soul Theme.
- [x] 2.2 Modificar `src/app/router.tsx` para incluir `/login` y proteger rutas privadas.
- [x] 2.3 Modificar `src/app/App.tsx` para inicializar el listener de Supabase Auth.
- [x] 2.4 Actualizar `AppLayout.tsx` para mostrar botón de Logout.

## Phase 3: Media & Library Implementation
- [x] 3.1 Actualizar formulario en `LibraryPage.tsx` para permitir subida de archivos reales.
- [x] 3.2 Integrar `storageService.uploadMelody` en el submit de melodías.
- [x] 3.3 Reemplazar placeholders en `LibraryPage.tsx` con un reproductor de audio funcional (HTML5 Audio).

## Phase 4: Testing & Quality
- [x] 4.1 Test: Verificar que el login fallido muestra alerta de error.
- [x] 4.2 Test: Verificar que un usuario no logueado es redirigido a `/login`.
- [x] 4.3 Test: Subir un MP3 y verificar que suena en la LibraryCard.
- [x] 4.4 Verificar persistencia de sesión tras refresh (F5).
