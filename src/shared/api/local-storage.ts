// shared/api/local-storage.ts - Implementación temporal con localStorage

import { nanoid } from 'nanoid';
import type { IRepository } from './base';

/**
 * LocalStorageRepository - Implementación temporal para MVP
 * 
 * 🔴 MIGRACIÓN A BACKEND:
 * 
 * Esta clase implementa persistencia usando localStorage del navegador.
 * Es una solución TEMPORAL para el MVP. Cuando exista un backend real:
 * 
 * 1. Crear HttpRepository<T> implementando IRepository<T>
   * 2. Reemplazar instancias en entities/asterisco/repository.ts:
 *    - Antes: new LocalStorageRepository<Student>('students')
 *    - Después: new HttpRepository<Student>({ baseUrl: '/api/students' })
 * 
 * 3. Agregar en HttpRepository:
 *    - Manejo de errores HTTP (retry, timeout)
 *    - Headers de autenticación
 *    - Transformación de datos (camelCase <-> snake_case)
 *    - Interceptors para logging
 *    - Optimistic updates si es necesario
 * 
 * 4. Considerar agregar cache layer:
 *    - React Query / SWR para cache automático
 *    - Invalidación de cache por mutaciones
 *    - Background refetch
 * 
 * NO CAMBIAR:
 * - Interfaz IRepository (se mantiene igual)
 * - Tipos de dominio (Student, ClassType, etc.)
 * - Lógica en features (componentes, hooks)
 * 
 * La arquitectura está diseñada para que esta migración sea
 * cambiar una línea por repositorio.
 */
export class LocalStorageRepository<T extends { id: string; createdAt: string; updatedAt: string }>
  implements IRepository<T> {
  
  constructor(private key: string) {}
  
  /**
   * Lee datos de localStorage
   */
  private read(): T[] {
    const data = localStorage.getItem(this.key);
    return data ? JSON.parse(data) : [];
  }
  
  /**
   * Escribe datos a localStorage
   */
  private write(data: T[]): void {
    localStorage.setItem(this.key, JSON.stringify(data));
  }
  
  async getAll(): Promise<T[]> {
    return this.read();
  }
  
  async getById(id: string): Promise<T | null> {
    const items = this.read();
    return items.find(item => item.id === id) || null;
  }
  
  async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    const items = this.read();
    const now = new Date().toISOString();
    
    const newItem = {
      ...data,
      id: nanoid(),
      createdAt: now,
      updatedAt: now,
    } as T;
    
    items.push(newItem);
    this.write(items);
    
    return newItem;
  }
  
  async update(id: string, data: Partial<T>): Promise<T> {
    const items = this.read();
    const index = items.findIndex(item => item.id === id);
    
    if (index === -1) {
      throw new Error(`Item with id ${id} not found`);
    }
    
    const updatedItem = {
      ...items[index],
      ...data,
      updatedAt: new Date().toISOString(),
    } as T;
    
    items[index] = updatedItem;
    this.write(items);
    
    return updatedItem;
  }
  
  async delete(id: string): Promise<void> {
    const items = this.read();
    const filtered = items.filter(item => item.id !== id);
    this.write(filtered);
  }
  
  async query(filters: Record<string, any>): Promise<T[]> {
    const items = this.read();
    
    return items.filter(item => {
      return Object.entries(filters).every(([key, value]) => {
        const itemValue = (item as any)[key];
        
        // Si el valor es un array, verificar inclusión
        if (Array.isArray(value)) {
          return value.includes(itemValue);
        }
        
        // Comparación directa
        return itemValue === value;
      });
    });
  }
  
  async search(searchTerm: string): Promise<T[]> {
    const items = this.read();
    const term = searchTerm.toLowerCase();
    
    return items.filter(item => {
      // Buscar en todos los campos string del objeto
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
}
