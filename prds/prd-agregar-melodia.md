# PRD: Agregar Melodía - LibraryPage

## 1. Overview
Permitir a los profesores agregar melodías (escalas, ejercicios, calentamientos, repertorio) a la biblioteca para uso en clases.

## 2. Problema
Actualmente el botón "Agregar Melodía" está deshabilitado. Los profesores no pueden agregar nuevo material didáctico.

## 3. Solución
Crear un formulario CRUD completo para melodías con los siguientes campos:
- Nombre (requerido)
- Descripción
- Categoría (requerido): escala, ejercicio, warmup, repertoire
- Dificultad: easy, medium, hard
- Tonalidad (key)
- Rango vocal
- Tempo
- Objetivo técnico
- Notas del profesor
- Tags
- URL de audio (placeholder)

## 4. Alcance
- **In Scope**: Formulario completo, guardado en localStorage, lista en grid
- **Out of Scope**: Reproducción de audio real, upload de archivos

## 5. Criterios de Aceptación
- [ ] Botón "Agregar Melodía"habilitado
- [ ] Formulario con validación Zod
- [ ] Guardar en melodyRepository
- [ ] Mostrar en grid con cards
- [ ] Editar melodía existente
- [ ] Eliminar melodía

## 6. Dependencias
- melodyRepository existente
- Melody type en domain.ts
- Componentes UI existentes (Card, Input, Select, Badge, Dialog)

## 7. Riesgos
- Ninguno significativo - funcionalidad aislada
