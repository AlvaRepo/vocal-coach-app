import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth-store';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading, initialized } = useAuthStore();
  const location = useLocation();

  if (!initialized || loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-medium animate-pulse text-primary italic">
            Sincronizando con el alma de Supabase...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirigir al login pero guardando la ubicación actual para volver después
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
