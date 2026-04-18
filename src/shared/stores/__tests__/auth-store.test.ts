import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuthStore } from '../auth-store';
import { supabase } from '../../api/supabase-client';

// Mock Supabase client
vi.mock('../../api/supabase-client', () => ({
  supabase: {
    auth: {
      signOut: vi.fn(),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      })),
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
    },
  },
}));

describe('AuthStore (El sensor de las Cerraduras)', () => {
  beforeEach(() => {
    // Reset store to initial state
    useAuthStore.setState({
      user: null,
      session: null,
      loading: true,
      initialized: false,
    });
    vi.clearAllMocks();
  });

  it('debería inicializar con carga activada', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.loading).toBe(true);
    expect(state.initialized).toBe(false);
  });

  it('debería actualizar el estado de sesión correctamente', () => {
    const mockUser = { id: '123', email: 'test@test.com' } as any;
    const mockSession = { user: mockUser, access_token: 'abc' } as any;
    
    useAuthStore.getState().setSession(mockSession);
    
    const state = useAuthStore.getState();
    expect(state.session).toBe(mockSession);
    expect(state.user).toBe(mockUser);
    expect(state.loading).toBe(false);
  });

  it('debería cerrar la sesión y limpiar el estado', async () => {
    (supabase.auth.signOut as any).mockResolvedValueOnce({ error: null });
    
    // Seteamos un estado inicial logueado
    useAuthStore.setState({ 
      user: { id: '123' } as any, 
      session: { access_token: 'abc' } as any,
      loading: false,
      initialized: true
    });
    
    await useAuthStore.getState().signOut();
    
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.session).toBeNull();
    expect(state.loading).toBe(false);
  });

  it('debería manejar errores al cerrar sesión', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    (supabase.auth.signOut as any).mockResolvedValueOnce({ error: new Error('Auth fail') });
    
    await useAuthStore.getState().signOut();
    
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
