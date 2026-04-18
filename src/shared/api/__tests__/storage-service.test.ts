import { describe, it, expect, vi, beforeEach } from 'vitest';
import { StorageService } from '../storage-service';
import { supabase } from '../supabase-client';

// Mock del cliente de Supabase para no llamar a la API real
vi.mock('../supabase-client', () => {
  const mockStorage = {
    from: vi.fn().mockReturnThis(),
    upload: vi.fn().mockResolvedValue({ data: { path: 'test/path.mp3' }, error: null }),
    getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: 'https://test.url/path.mp3' } }),
    remove: vi.fn().mockResolvedValue({ data: [], error: null }),
  };

  return {
    supabase: {
      storage: mockStorage,
    },
  };
});

describe('StorageService (El sensor de la Caja Fuerte)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debería subir una melodía correctamente', async () => {
    const file = new File([''], 'test.mp3', { type: 'audio/mpeg' });
    const path = 'test-folder/test.mp3';

    const result = await StorageService.uploadMelody(file, path);

    // Verificamos que se llame al bucket correcto
    expect(supabase.storage.from).toHaveBeenCalledWith('melodies');
    
    // Verificamos que se intente subir el archivo con los datos correctos
    expect(supabase.storage.from('melodies').upload).toHaveBeenCalledWith(
      path,
      file,
      expect.objectContaining({ upsert: true })
    );

    expect(result).toBe('test/path.mp3');
  });

  it('debería obtener la URL pública de un archivo', () => {
    const path = 'some/audio.mp3';
    const url = StorageService.getPublicUrl(path);

    expect(supabase.storage.from).toHaveBeenCalledWith('melodies');
    expect(supabase.storage.from('melodies').getPublicUrl).toHaveBeenCalledWith(path);
    expect(url).toBe('https://test.url/path.mp3');
  });

  it('debería borrar un archivo correctamente', async () => {
    const path = 'delete/this.mp3';
    await StorageService.deleteFile(path);

    expect(supabase.storage.from).toHaveBeenCalledWith('melodies');
    expect(supabase.storage.from('melodies').remove).toHaveBeenCalledWith([path]);
  });

  it('debería lanzar un error si la subida falla', async () => {
    const file = new File([''], 'fail.mp3');
    const path = 'fail/path.mp3';

    // Simulamos un error de Supabase
    (supabase.storage.from('melodies').upload as any).mockResolvedValueOnce({
      data: null,
      error: new Error('Simulated failure'),
    });

    await expect(StorageService.uploadMelody(file, path)).rejects.toThrow('Simulated failure');
  });
});
