// shared/api/base.ts - Repository Pattern Base

/**
 * Interfaz genérica para repositorios de datos.
 * 
 * Esta interfaz define el contrato que todas las implementaciones
 * de repositorio deben seguir, permitiendo intercambiar fácilmente
 * entre diferentes estrategias de persistencia (localStorage, HTTP, etc.)
 */
export interface IRepository<T> {
  /**
   * Obtiene todos los registros
   */
  getAll(): Promise<T[]>;
  
  /**
   * Obtiene un registro por ID
   */
  getById(id: string): Promise<T | null>;
  
  /**
   * Crea un nuevo registro
   */
  create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>;
  
  /**
   * Actualiza un registro existente
   */
  update(id: string, data: Partial<T>): Promise<T>;
  
  /**
   * Elimina un registro
   */
  delete(id: string): Promise<void>;
  
  /**
   * Consulta registros con filtros
   */
  query(filters: Record<string, any>): Promise<T[]>;
  
  /**
   * Busca registros que coincidan con un texto
   */
  search(searchTerm: string): Promise<T[]>;
}

/**
 * Tipo helper para datos de creación (sin campos auto-generados)
 */
export type CreateData<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Tipo helper para datos de actualización (parcial)
 */
export type UpdateData<T> = Partial<Omit<T, 'id' | 'createdAt'>>;
