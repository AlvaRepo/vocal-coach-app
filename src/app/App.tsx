// app/App.tsx

import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';
import { router } from './router';
import { seedDatabase } from '@/shared/lib/seed-data';

export function App() {
  useEffect(() => {
    // Inicializar base de datos con seed data en el primer arranque
    seedDatabase();
  }, []);

  return (
    <>
      {/* Capa de ruido analógico */}
      <div className="noise-overlay" aria-hidden="true" />
      
      <RouterProvider router={router} />
      <Toaster 
        position="top-right" 
        theme="dark"
        toastOptions={{
          style: {
            background: '#111318',
            border: '1px solid rgba(201, 51, 255, 0.3)',
            color: '#E2E8F0',
          },
        }}
      />
    </>
  );
}
