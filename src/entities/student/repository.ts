// entities/student/repository.ts

import { LocalStorageRepository } from '@/shared/api/local-storage';
import type { Student } from '@/shared/types/domain';

/**
 * Repository para gestión de alumnos
 * 
 * 🔴 MIGRACIÓN FUTURA:
 * Cuando exista backend, reemplazar por:
 * export const studentRepository = new HttpRepository<Student>({
 *   baseUrl: '/api/students'
 * });
 */
export const studentRepository = new LocalStorageRepository<Student>('students');
