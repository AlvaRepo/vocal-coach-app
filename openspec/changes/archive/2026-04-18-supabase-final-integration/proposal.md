# Proposal: Supabase Final Integration (Auth + Storage)

## Intent
Transformar la aplicación en una plataforma segura y funcional reemplazando los placeholders de audio por almacenamiento real (Supabase Storage) y securizando el acceso mediante Autenticación de Supabase.

## Scope

### In Scope
- **User Authentication**: Flujo de login completo y persistencia de sesión.
- **Protected Routes**: Redirección automática a `/login` para rutas privadas.
- **Media Storage**: Subida de archivos MP3/WAV para la biblioteca de melodías.
- **Audio Player**: Reproducción real de audios en `LibraryPage`.
- **UI Refresh**: Sidebar con perfil de usuario y cierre de sesión.

### Out of Scope
- **Social Auth**: Google/GitHub login (se mantendrá Email/Password para este cambio).
- **Public Registration**: Registro de usuarios abierto (se asume creación manual en dashboard por ahora).
- **Audio Editing**: Transposición o edición de tempo (se queda como futura mejora).

## Capabilities

### New Capabilities
- `user-authentication`: Manejo de identidad, roles básicos y persistencia de sesión.
- `media-storage`: Servicio de upload y gestión de buckets para audios.

### Modified Capabilities
- `melody-management`: Se actualiza para permitir archivos reales en lugar de referencias de texto.

## Approach
Implementar un `auth-store` global (Zustand) que sincronice con `supabase.auth`. Usar un `ProtectedRoute` wrapper en el router para centralizar la seguridad. Utilizar el bucket `melodies` de Supabase Storage para los archivos, almacenando el `path` relativo en la base de datos para generar URLs temporales o públicas.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/app/App.tsx` | Modified | Inyección de Auth Listener. |
| `src/app/router.tsx` | Modified | Implementación de Rutas Protegidas y ruta `/login`. |
| `src/features/library` | Modified | Formulario de subida y reproductor técnico. |
| `src/shared/api` | New | `storage-service.ts` para uploads. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| CORS / Bucket Permissions | Medium | Guía manual clara para el usuario sobre configuración del bucket. |
| Session Expiry | Low | Configurar Supabase Client con `autoRefreshToken: true`. |

## Rollback Plan
Revertir cambios en `router.tsx` para quitar el `ProtectedRoute` y restaurar mappers de melodías que usaban `audioFileReference` como string plano.

## Dependencies
- Bucket `melodies` creado en Supabase.
- Habilitar proveedor de Email en Supabase Auth.

## Success Criteria
- [ ] No se puede acceder a `/notes` sin estar logueado.
- [ ] Al subir un audio en `LibraryPage`, se puede escuchar en la tarjeta de la melodía.
- [ ] El estado del login persiste tras refrescar la página.
