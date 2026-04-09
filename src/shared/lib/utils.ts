// shared/lib/utils.ts

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina clases CSS con soporte para Tailwind CSS
 * Merge inteligente que evita conflictos de clases de Tailwind
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formatea un nombre completo a partir de firstName y lastName
 */
export function formatFullName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`.trim();
}

/**
 * Obtiene las iniciales de un nombre
 */
export function getInitials(firstName: string, lastName?: string): string {
  if (!lastName) {
    return firstName.charAt(0).toUpperCase();
  }
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

/**
 * Trunca un texto a una longitud máxima
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Delay para simulaciones o debouncing
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
