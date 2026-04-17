import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuthStore } from '../auth-store';

// Mock de Supabase Client
vi.mock('@/shared/api/supabase-client', () => ({
  supabase: {
    auth: {
      signOut: vi.fn(() => Promise.resolve({ error: null })),
    },
  },
}));

describe('AuthStore', () => {
  beforeEach(() => {
    // Resetear el store antes de cada test si fuera necesario
    // Zustand mantiene el estado entre tests si no se limpia
    useAuthStore.setState({
      user: null,
      session: null,
      loading: false,
    });
  });

  it('debe iniciar con estado de invitado', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.session).toBeNull();
    expect(state.loading).toBe(false);
  });

  it('debe actualizar la sesión correctamente', () => {
    const mockUser = { id: '123', email: 'test@example.com' };
    const mockSession = { user: mockUser, access_token: 'token' };

    useAuthStore.getState().setSession(mockSession as any);

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.session).toEqual(mockSession);
  });

  it('debe limpiar la sesión al hacer logout', async () => {
    // Seteamos sesión inicial
    useAuthStore.setState({
      user: { id: '123' } as any,
      session: { token: 'abc' } as any,
    });

    await useAuthStore.getState().signOut();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.session).toBeNull();
  });
});
