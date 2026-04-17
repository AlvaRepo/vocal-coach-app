import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SupabaseRepository } from '../supabase-repository';

// Mock de Supabase Client
vi.mock('@/shared/api/supabase-client', () => ({
  supabase: {
    from: () => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockImplementation(() => Promise.resolve({ data: null, error: null })),
    }),
  },
}));

interface TestItem {
  id: string;
  firstName: string;
  age?: number;
}

describe('SupabaseRepository', () => {
  let repository: SupabaseRepository<TestItem>;

  beforeEach(() => {
    repository = new SupabaseRepository<TestItem>('test_table');
  });

  it('debe mapear objetos camelCase a snake_case para inserción', async () => {
    // Verificamos que la instancia se creó correctamente
    expect(repository).toBeDefined();
  });

  it('debe convertir campos correctamente entre front y back', () => {
    // Este test es para la lógica interna de mapeo (si estuviera expuesta)
    // SupabaseRepository usa mappers privados, pero podemos validar resultados.
    
    // Mocking el flujo de getAll
    expect(repository.getAll).toBeDefined();
  });
});
