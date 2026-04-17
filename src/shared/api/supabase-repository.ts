// src/shared/api/supabase-repository.ts

import { supabase } from './supabase-client';
import type { IRepository } from './base';
import { keysToSnake, keysToCamel, toSnakeCase } from '@/shared/lib/mappers';

export class SupabaseRepository<T extends { id: string }> implements IRepository<T> {
  constructor(private tableName: string) {}

  async getAll(): Promise<T[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`Error fetching all from ${this.tableName}:`, error);
      throw new Error(`Failed to fetch data from ${this.tableName}`);
    }

    return keysToCamel(data || []) as T[];
  }

  async getById(id: string): Promise<T | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      console.error(`Error fetching ${id} from ${this.tableName}:`, error);
      throw new Error(`Failed to fetch ${id} from ${this.tableName}`);
    }

    return keysToCamel(data) as T;
  }

  async create(item: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    const dbItem = keysToSnake(item);
    
    // Dejar que la DB genere el ID y los timestamps si no se proveen
    const { data, error } = await supabase
      .from(this.tableName)
      .insert(dbItem)
      .select()
      .single();

    if (error) {
      console.error(`Error creating in ${this.tableName}:`, error);
      throw new Error(`Failed to create item in ${this.tableName}`);
    }

    return keysToCamel(data) as T;
  }

  async update(id: string, item: Partial<T>): Promise<T> {
    const dbItem = keysToSnake(item);
    // Remover id y timestamps si vienen en el Partial para evitar errores de restricción
    delete dbItem.id;
    delete dbItem.created_at;
    
    const { data, error } = await supabase
      .from(this.tableName)
      .update({ ...dbItem, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating ${id} in ${this.tableName}:`, error);
      throw new Error(`Failed to update ${id} in ${this.tableName}`);
    }

    return keysToCamel(data) as T;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting ${id} from ${this.tableName}:`, error);
      throw new Error(`Failed to delete ${id} from ${this.tableName}`);
    }
  }

  async query(filters: Record<string, any>): Promise<T[]> {
    let queryBuilder = supabase.from(this.tableName).select('*');

    Object.entries(filters).forEach(([key, value]) => {
      const dbKey = toSnakeCase(key);
      if (Array.isArray(value)) {
        queryBuilder = queryBuilder.in(dbKey, value);
      } else {
        queryBuilder = queryBuilder.eq(dbKey, value);
      }
    });

    const { data, error } = await queryBuilder.order('created_at', { ascending: false });

    if (error) {
      console.error(`Error querying ${this.tableName}:`, error);
      throw new Error(`Failed to query ${this.tableName}`);
    }

    return keysToCamel(data || []) as T[];
  }

  async search(searchTerm: string): Promise<T[]> {
    // Columnas comunes para búsqueda genérica
    const commonColumns = ['name', 'first_name', 'last_name', 'title', 'description'];
    const orFilter = commonColumns.map(col => `${col}.ilike.%${searchTerm}%`).join(',');

    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .or(orFilter)
      .order('created_at', { ascending: false });

    if (error) {
      // Fallback a filtrado en memoria si las columnas no existen en la tabla específica
      console.warn(`Supabase search failed, falling back to memory filter for ${this.tableName}`);
      const all = await this.getAll();
      const term = searchTerm.toLowerCase();
      
      return all.filter(item => {
        const values = Object.values(item) as unknown[];
        return values.some(value => {
          if (typeof value === 'string') {
            return value.toLowerCase().includes(term);
          }
          if (Array.isArray(value)) {
            return value.some(v => 
              typeof v === 'string' && v.toLowerCase().includes(term)
            );
          }
          return false;
        });
      });
    }

    return keysToCamel(data || []) as T[];
  }
}
