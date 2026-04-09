// shared/lib/date-utils.ts

import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Formatea una fecha ISO string a formato legible
 */
export function formatDate(dateString: string | undefined, formatStr: string = 'dd/MM/yyyy'): string {
  if (!dateString) return '-';
  
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return '-';
    return format(date, formatStr, { locale: es });
  } catch {
    return '-';
  }
}

/**
 * Formatea fecha con hora
 */
export function formatDateTime(dateString: string | undefined): string {
  return formatDate(dateString, 'dd/MM/yyyy HH:mm');
}

/**
 * Formatea fecha de forma relativa ("hace 2 días")
 */
export function formatRelativeDate(dateString: string | undefined): string {
  if (!dateString) return '-';
  
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return '-';
    return formatDistanceToNow(date, { addSuffix: true, locale: es });
  } catch {
    return '-';
  }
}

/**
 * Obtiene el ISO string del día actual
 */
export function getTodayISO(): string {
  return new Date().toISOString();
}

/**
 * Convierte Date a ISO string
 */
export function toISOString(date: Date): string {
  return date.toISOString();
}
