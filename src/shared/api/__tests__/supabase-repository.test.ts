import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SupabaseRepository } from '../supabase-repository';
import { supabase } from '../supabase-client';

// Mock Supabase client
vi.mock('../supabase-client', () => {
  const mockQueryBuilder = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    or: vi.fn().mockReturnThis(),
    then: vi.fn(function(this: any, cb: any) {
      return Promise.resolve(cb({ data: this._data || null, error: this._error || null }));
    }),
    _data: null as any,
    _error: null as any,
    // Helper para setear data en el mock
    _setData(data: any) { this._data = data; return this; },
    _setError(error: any) { this._error = error; return this; },
  };

  return {
    supabase: {
      from: vi.fn(() => mockQueryBuilder),
    },
  };
});

describe('SupabaseRepository (El sensor de las Libretas)', () => {
  const repo = new SupabaseRepository<{ id: string; name: string; age?: number }>('test_table');
  let queryBuilder: any;

  beforeEach(() => {
    vi.clearAllMocks();
    queryBuilder = supabase.from('test_table');
    queryBuilder._data = null;
    queryBuilder._error = null;
  });

  it('debería traer todos los registros (getAll)', async () => {
    const mockData = [{ id: '1', name: 'Test' }];
    queryBuilder._setData(mockData);

    const result = await repo.getAll();

    expect(supabase.from).toHaveBeenCalledWith('test_table');
    expect(queryBuilder.select).toHaveBeenCalledWith('*');
    expect(queryBuilder.order).toHaveBeenCalledWith('created_at', { ascending: false });
    expect(result).toEqual(mockData);
  });

  it('debería traer un registro por ID (getById)', async () => {
    const mockData = { id: '1', name: 'Test' };
    queryBuilder._setData(mockData);

    const result = await repo.getById('1');

    expect(queryBuilder.eq).toHaveBeenCalledWith('id', '1');
    expect(queryBuilder.single).toHaveBeenCalled();
    expect(result).toEqual(mockData);
  });

  it('debería crear un registro (create)', async () => {
    const newItem = { name: 'New Student' };
    const mockData = { id: 'uuid-123', name: 'New Student' };
    queryBuilder._setData(mockData);

    const result = await repo.create(newItem);

    expect(queryBuilder.insert).toHaveBeenCalledWith({ name: 'New Student' });
    expect(queryBuilder.select).toHaveBeenCalled();
    expect(result).toEqual(mockData);
  });

  it('debería actualizar un registro (update)', async () => {
    const updateData = { name: 'Updated Name' };
    const mockData = { id: '1', name: 'Updated Name' };
    queryBuilder._setData(mockData);

    const result = await repo.update('1', updateData);

    expect(queryBuilder.update).toHaveBeenCalled();
    expect(queryBuilder.eq).toHaveBeenCalledWith('id', '1');
    expect(result).toEqual(mockData);
  });

  it('debería borrar un registro (delete)', async () => {
    queryBuilder._setData(null);

    await repo.delete('1');

    expect(queryBuilder.delete).toHaveBeenCalled();
    expect(queryBuilder.eq).toHaveBeenCalledWith('id', '1');
  });

  it('debería filtrar con query personalizada', async () => {
    const filters = { name: 'Test', tags: ['a', 'b'] };
    const mockData = [{ id: '1', name: 'Test' }];
    queryBuilder._setData(mockData);

    const result = await repo.query(filters);

    expect(queryBuilder.eq).toHaveBeenCalledWith('name', 'Test');
    expect(queryBuilder.in).toHaveBeenCalledWith('tags', ['a', 'b']);
    expect(result).toEqual(mockData);
  });
});
