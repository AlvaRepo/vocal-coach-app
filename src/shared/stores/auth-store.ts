import { create } from 'zustand';
import { supabase } from '../api/supabase-client';
import type { User, Session } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;
  
  // Actions
  setSession: (session: Session | null) => void;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: true,
  initialized: false,

  setSession: (session) => set({ 
    session, 
    user: session?.user ?? null,
    loading: false 
  }),
  
  setUser: (user) => set({ user }),
  
  setLoading: (loading) => set({ loading }),
  
  setInitialized: (initialized) => set({ initialized }),

  signOut: async () => {
    set({ loading: true });
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, session: null });
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      set({ loading: false });
    }
  },
}));

// Helper para inicializar el listener de auth
export const initAuthListener = () => {
  // 1. Obtener sesión inicial
  supabase.auth.getSession().then(({ data: { session } }) => {
    useAuthStore.getState().setSession(session);
    useAuthStore.getState().setInitialized(true);
  });

  // 2. Escuchar cambios
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    useAuthStore.getState().setSession(session);
    useAuthStore.getState().setInitialized(true);
  });

  return subscription;
};
