# PRD: Agregar Nota - NotesPage

## 1. Overview
Permitir a los profesores crear, editar y eliminar notas personales asociadas a alumnos o clases.

## 2. Problema
Actualmente el botón "Agregar Nota" está deshabilitado. Los profesores no pueden tomar notas durante las clases.

## 3. Solución
Crear un formulario CRUD para notas con:
- Título (requerido)
- Contenido (requerido)
- Tipo de nota: general, clase, progreso, observación
- Alumno asociado (opcional)
- Fecha
- Tags

## 4. Alcance
- **In Scope**: Formulario CRUD, guardado en localStorage, lista de notas filtrable por alumno
- **Out of Scope**: Notificaciones, exportación

## 5. Criterios de Aceptación
- [ ] Botón "Agregar Nota" habilitado
- [ ] Formulario con validación Zod
- [ ] Guardar en noteRepository
- [ ] Lista de notas con filtro por alumno
- [ ] Editar nota existente
- [ ] Eliminar nota
- [ ] Filtrar por tipo de nota

## 6. Dependencias
- noteRepository existente
- Note type en domain.ts
- Select para alumno (reutilizar de studentRepository)

## 7. Riesgos
- Ninguno significativo
