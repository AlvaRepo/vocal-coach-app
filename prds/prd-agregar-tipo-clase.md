# PRD: Agregar Tipo de Clase - ClassTypesPage

## 1. Overview
Permitir gestionar los tipos de clase disponibles (particular, coro, grupal, workshop, etc.).

## 2. Problema
El botón "Agregar Tipo de Clase" está deshabilitado. No se pueden crear nuevos tipos de clase.

## 3. Solución
CRUD para ClassType con:
- Nombre (requerido)
- Descripción
- Duración sugerida (minutos)
- Objetivos (array)
- Estructura/Templates

## 4. Alcance
- **In Scope**: Formulario CRUD, guardado en localStorage
- **Out of Scope**: Templates complejos

## 5. Criterios de Aceptación
- [ ] Botón habilitado
- [ ] Formulario con validación
- [ ] Guardar en classTypeRepository
- [ ] Lista de tipos de clase
- [ ] Editar tipo existente
- [ ] Eliminar tipo (solo si no está en uso)

## 6. Dependencias
- classTypeRepository existente
- ClassType interface en domain.ts

## 7. Riesgos
- Integridad referencial: verificar si el tipo está en uso antes de eliminar
