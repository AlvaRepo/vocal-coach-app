/**
 * Convierte un string de camelCase a snake_case
 */
export function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

/**
 * Convierte un string de snake_case a camelCase
 */
export function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Convierte todas las llaves de un objeto de camelCase a snake_case (recursivo)
 */
export function keysToSnake(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(v => keysToSnake(v));
  } else if (typeof obj === 'object' && obj.constructor === Object) {
    return Object.keys(obj).reduce(
      (result, key) => ({
        ...result,
        [toSnakeCase(key)]: keysToSnake(obj[key]),
      }),
      {}
    );
  }
  return obj;
}

/**
 * Convierte todas las llaves de un objeto de snake_case a camelCase (recursivo)
 */
export function keysToCamel(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(v => keysToCamel(v));
  } else if (typeof obj === 'object' && obj.constructor === Object) {
    return Object.keys(obj).reduce(
      (result, key) => ({
        ...result,
        [toCamelCase(key)]: keysToCamel(obj[key]),
      }),
      {}
    );
  }
  return obj;
}
