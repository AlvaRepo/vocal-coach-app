# Design: Supabase Final Integration (Auth + Storage)

## Technical Approach
Implementar una capa de seguridad y multimedia sobre el cliente de Supabase existente. La autenticación se manejará mediante un store global reactivo (Zustand) que escuchará los eventos de Supabase. El almacenamiento de archivos usará la API de Storage de Supabase, integrándose directamente en el flujo de guardado de melodías.

## Architecture Decisions

### Decision: State Management for Auth
**Choice**: Zustand (`useAuthStore`).
**Alternatives considered**: React Context, Redux.
**Rationale**: Ya se usa Zustand para `ui-store`. Es más ligero que Redux y evita el "provider nesting" profundo de Context para un estado global simple como la sesión.

### Decision: Protected Route Pattern
**Choice**: Higher-Order Component / Wrapper (`ProtectedRoute`).
**Alternatives considered**: Route loaders (React Router 6+).
**Rationale**: Más fácil de integrar con el estado reactivo de Zustand y permite animaciones de transición de carga consistentes.

### Decision: Storage Strategy
**Choice**: Relative Path Storage.
**Alternatives considered**: Base64 in DB, Public URL Storage.
**Rationale**: Almacenar el `path` (ej: `melodies/scale-1.mp3`) permite rotar buckets o cambiar el dominio de Supabase sin romper la base de datos. La URL se genera dinámicamente.

## Data Flow

    [User] ──→ [LoginPage] ──→ [Supabase Auth] ──→ [AuthStore] ──→ [AppLayout/Router]
    
    [LibraryPage] ──→ [File Input] ──→ [StorageService] ──→ [Supabase Storage]
                                            │
                                            └──→ [DB: melodies.audio_url]

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/shared/stores/auth-store.ts` | Create | Gestión de sesión y usuario. |
| `src/shared/api/storage-service.ts` | Create | Lógica de upload/download de Supabase Storage. |
| `src/shared/components/auth/ProtectedRoute.tsx` | Create | Guardián de rutas. |
| `src/features/auth/pages/LoginPage.tsx` | Create | UI de login (Soul Theme). |
| `src/app/router.tsx` | Modify | Configuración de rutas privadas. |
| `src/features/library/pages/LibraryPage.tsx` | Modify | Integración de File Input y Player. |

## Interfaces / Contracts

```typescript
// src/shared/stores/auth-store.ts
interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<void>;
  signOut: () => Promise<void>;
}

// src/shared/api/storage-service.ts
interface StorageService {
  uploadMelody: (file: File) => Promise<string>; // returns path
  getMelodyUrl: (path: string) => string;
}
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | AuthStore logic | Mock Supabase Auth client y verificar transiciones de estado. |
| Integration | LoginPage | Simular ingreso de datos y click en submit. |
| E2E | Flow completo | Login -> Library -> Upload MP3 -> Ver Playback. |

## Migration / Rollout
- No hay migración de datos necesaria (las melodías actuales no tienen audio real).
- Se requiere crear el bucket `melodies` en Supabase dashboard (Manual).
