import { supabase } from './supabase-client';

export class StorageService {
  private static BUCKET_NAME = 'melodies';

  /**
   * Sube un archivo al bucket de melodías
   * @param file El archivo a subir
   * @param path El path dentro del bucket (ej: id-del-alumno/nombre-archivo.mp3)
   * @returns El path relativo del archivo guardado
   */
  static async uploadMelody(file: File, path: string): Promise<string> {
    const { data, error } = await supabase.storage
      .from(this.BUCKET_NAME)
      .upload(path, file, {
        upsert: true,
        cacheControl: '3600',
      });

    if (error) {
      console.error('Error uploading file to storage:', error);
      throw error;
    }

    return data.path;
  }

  /**
   * Obtiene la URL pública de un archivo
   * @param path El path relativo guardado en la DB
   */
  static getPublicUrl(path: string): string {
    const { data } = supabase.storage
      .from(this.BUCKET_NAME)
      .getPublicUrl(path);

    return data.publicUrl;
  }

  /**
   * Elimina un archivo del storage
   */
  static async deleteFile(path: string): Promise<void> {
    const { error } = await supabase.storage
      .from(this.BUCKET_NAME)
      .remove([path]);

    if (error) {
      console.error('Error deleting file from storage:', error);
      throw error;
    }
  }
}
