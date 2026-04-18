// shared/stores/ui-store.ts

import { create } from 'zustand';

interface UIStore {
  // Sidebar
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  
  // View mode para listas
  viewMode: 'list' | 'grid';
  setViewMode: (mode: 'list' | 'grid') => void;
  
  // Modal de búsqueda global (Cmd+K)
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  toggleSearch: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  // Sidebar - por defecto cerrado para evitar fricción visual
  sidebarOpen: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  
  // View mode
  viewMode: 'grid',
  setViewMode: (mode) => set({ viewMode: mode }),
  
  // Search
  searchOpen: false,
  setSearchOpen: (open) => set({ searchOpen: open }),
  toggleSearch: () => set((state) => ({ searchOpen: !state.searchOpen })),
}));
