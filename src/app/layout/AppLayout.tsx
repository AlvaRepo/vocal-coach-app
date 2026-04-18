// app/layout/AppLayout.tsx

import { useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  StickyNote,
  Library,
  Calendar,
  Settings,
  Menu,
  Music,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { useUIStore } from '@/shared/stores/ui-store';
import { useAuthStore } from '@/shared/stores/auth-store';
import { Button } from '@/shared/components/ui/button';
import { Separator } from '@/shared/components/ui/separator';
import { version } from '../../../package.json';

const pageNames: Record<string, string> = {
  '/': 'Dashboard',
  '/students': 'Alumnos',
  '/students/new': 'Nuevo Alumno',
  '/classes/types': 'Tipos de Clase',
  '/classes/plans': 'Planes de Clase',
  '/classes/records': 'Registros de Clase',
  '/notes': 'Notas',
  '/library': 'Biblioteca',
  '/calendar': 'Calendario',
  '/settings': 'Configuración',
};

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Alumnos', href: '/students', icon: Users },
  { name: 'Clases', href: '/classes/types', icon: BookOpen },
  { name: 'Notas', href: '/notes', icon: StickyNote },
  { name: 'Biblioteca', href: '/library', icon: Library },
  { name: 'Calendario', href: '/calendar', icon: Calendar },
];

const secondaryNavigation = [
  { name: 'Configuración', href: '/settings', icon: Settings },
];

export function AppLayout() {
  const location = useLocation();
  const { sidebarOpen, toggleSidebar, setSidebarOpen } = useUIStore();
  const { user, signOut } = useAuthStore();
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;

  // Cerrar sidebar al navegar en mobile
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile, setSidebarOpen]);

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar con Glassmorphism */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen w-64 border-r border-white/5 bg-surface-dark/80 backdrop-blur-md transition-transform',
          !sidebarOpen && '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo / Header */}
          <div className="flex h-16 items-center gap-2 border-b border-white/5 px-6">
            <Music className="h-6 w-6 text-soul-magenta" />
            <span className="text-lg font-semibold font-serif text-foreground">Vocal Coach</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href ||
                (item.href !== '/' && location.pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-white/5 text-foreground border-l-2 border-soul-magenta'
                      : 'text-muted-foreground hover:bg-surface-dark hover:text-foreground hover:translate-x-1'
                  )}
                >
                  <item.icon className="h-5 w-5" style={{ strokeWidth: 1.25 }} />
                  {item.name}
                </Link>
              );
            })}

            <Separator className="my-4 bg-white/5" />

            {secondaryNavigation.map((item) => {
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-white/5 text-foreground border-l-2 border-soul-magenta'
                      : 'text-muted-foreground hover:bg-surface-dark hover:text-foreground hover:translate-x-1'
                  )}
                >
                  <item.icon className="h-5 w-5" style={{ strokeWidth: 1.25 }} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-white/5 p-4 space-y-3">
            <div className="flex items-center gap-3 px-2">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary ring-1 ring-primary/30">
                {user?.email?.substring(0, 2).toUpperCase() || 'VC'}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-medium text-foreground truncate">{user?.email}</p>
                <p className="text-[10px] text-muted-foreground truncate italic">Director</p>
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={signOut}
              className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Cerrar Sesión</span>
            </Button>

            <Separator className="bg-white/5" />
            
            <div className="px-2">
              <p className="text-[10px] text-muted-foreground/60 font-medium">
                Vocal Coach Admin v{version}
              </p>
              <p className="text-[10px] text-soul-magenta/60 font-bold tracking-tighter uppercase">
                Supabase Backend
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className={cn('lg:pl-64', !sidebarOpen && 'lg:pl-0')}>
        {/* Top bar con Glassmorphism */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-white/5 bg-surface-dark/80 backdrop-blur-md px-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="lg:hidden text-foreground hover:bg-surface-dark"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Page breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <Music className="h-4 w-4 text-soul-magenta" />
            <span className="text-muted-foreground">Vocal Coach</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
            <span className="font-medium text-foreground">
              {pageNames[location.pathname] || pageNames[location.pathname.split('/').slice(0, 2).join('/')] || 'Dashboard'}
            </span>
          </div>

          <div className="flex-1" />

          {/* Profile Quick Access */}
          <div className="flex items-center gap-3 lg:hidden">
            <Button variant="ghost" size="icon" onClick={signOut} className="text-muted-foreground hover:text-destructive">
               <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Page content con transición */}
        <main className="p-6 animate-fade-in">
          <Outlet />
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
}
