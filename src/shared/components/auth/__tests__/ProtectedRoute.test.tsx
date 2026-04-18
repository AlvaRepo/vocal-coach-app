import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProtectedRoute } from '../ProtectedRoute';
import { useAuthStore } from '@/shared/stores/auth-store';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

// Mock the entire module
vi.mock('@/shared/stores/auth-store', () => ({
  useAuthStore: vi.fn(),
}));

const MockChild = () => <div>Protected Content</div>;
const MockLogin = () => <div>Login Page</div>;

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show loading indicator when not initialized', () => {
    // Cast to Mock to access Vitest mock methods
    vi.mocked(useAuthStore).mockReturnValue({
      user: null,
      loading: true,
      initialized: false,
    } as any);

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <MockChild />
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText(/Sincronizando con el alma de Supabase/i)).toBeInTheDocument();
  });

  it('should redirect to /login when not authenticated', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: null,
      loading: false,
      initialized: true,
    } as any);

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/protected" element={
            <ProtectedRoute>
              <MockChild />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<MockLogin />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Login Page/i)).toBeInTheDocument();
  });

  it('should render children when authenticated', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: { id: '123' } as any,
      loading: false,
      initialized: true,
    } as any);

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <MockChild />
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText(/Protected Content/i)).toBeInTheDocument();
  });
});
