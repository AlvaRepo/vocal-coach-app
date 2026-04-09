// entities/student/utils.ts

import type { Student, StudentStatus, VocalRange } from '@/shared/types/domain';
import { formatFullName, getInitials } from '@/shared/lib/utils';

/**
 * Obtiene el nombre completo del alumno
 */
export function getStudentFullName(student: Student): string {
  return formatFullName(student.firstName, student.lastName);
}

/**
 * Obtiene las iniciales del alumno
 */
export function getStudentInitials(student: Student): string {
  return getInitials(student.firstName, student.lastName);
}

/**
 * Obtiene el color del badge según el estado del alumno
 */
export function getStatusColor(status: StudentStatus): 'default' | 'success' | 'warning' | 'destructive' | 'secondary' {
  const colors: Record<StudentStatus, 'default' | 'success' | 'warning' | 'destructive' | 'secondary'> = {
    active: 'success',
    paused: 'warning',
    graduated: 'default',
    archived: 'secondary'
  };
  return colors[status];
}

/**
 * Obtiene el texto legible del estado
 */
export function getStatusLabel(status: StudentStatus): string {
  const labels: Record<StudentStatus, string> = {
    active: 'Activo',
    paused: 'Pausado',
    graduated: 'Egresado',
    archived: 'Archivado'
  };
  return labels[status];
}

/**
 * Obtiene el texto legible del tipo de alumno
 */
export function getTypeLabel(type: Student['type']): string {
  const labels: Record<Student['type'], string> = {
    choir: 'Coro',
    private: 'Clase Particular',
    both: 'Coro + Particular'
  };
  return labels[type];
}

/**
 * Obtiene el texto legible del nivel
 */
export function getLevelLabel(level?: Student['level']): string {
  if (!level) return 'No definido';
  const labels: Record<NonNullable<Student['level']>, string> = {
    beginner: 'Principiante',
    intermediate: 'Intermedio',
    advanced: 'Avanzado'
  };
  return labels[level];
}

/**
 * Obtiene el texto legible de la tesitura
 */
export function getVocalRangeLabel(range?: VocalRange): string {
  if (!range || range === 'undefined') return 'No definido';
  const labels: Record<Exclude<VocalRange, 'undefined'>, string> = {
    soprano: 'Soprano',
    mezzo: 'Mezzosoprano',
    alto: 'Alto/Contralto',
    tenor: 'Tenor',
    baritone: 'Barítono',
    bass: 'Bajo'
  };
  return labels[range];
}

/**
 * Calcula el promedio de evaluación técnica
 */
export function calculateTechnicalAverage(student: Student): number | null {
  if (!student.technicalAssessment) return null;
  
  const values = Object.values(student.technicalAssessment).filter(
    (v): v is number => typeof v === 'number'
  );
  
  if (values.length === 0) return null;
  
  const sum = values.reduce((acc, val) => acc + val, 0);
  return Math.round((sum / values.length) * 10) / 10;
}

/**
 * Verifica si un alumno está activo
 */
export function isActiveStudent(student: Student): boolean {
  return student.status === 'active';
}

/**
 * Filtra alumnos por estado
 */
export function filterByStatus(students: Student[], status: StudentStatus): Student[] {
  return students.filter(s => s.status === status);
}

/**
 * Filtra alumnos activos
 */
export function getActiveStudents(students: Student[]): Student[] {
  return filterByStatus(students, 'active');
}
