# PRD: Agregar Plan de Clase - ClassPlansPage

## 1. Overview
Permitir a los profesores planificar clases asignando fecha, estudiante, tipo de clase y objetivos.

## 2. Problema
El botón "Planificar Clase" está deshabilitado. No se pueden agendar clases.

## 3. Solución
Formulario para crear planes de clase:
- Título (requerido)
- Estudiante (requerido, seleccionar de lista)
- Tipo de clase (requerido, de ClassType)
- Fecha y hora
- Objetivos de la clase
- Estado: draft, ready, completed, cancelled

## 4. Alcance
- **In Scope**: Formulario, guardado en localStorage, vista de calendario/listado
- **Out of Scope**: Notificaciones, recordatorios

## 5. Criterios de Aceptación
- [ ] Botón habilitado
- [ ] Selector de estudiante (reutilizar studentRepository)
- [ ] Selector de tipo de clase
- [ ] Guardar en classPlanRepository
- [ ] Lista de planes filtrable por estudiante/fecha
- [ ] Editar/Cancelar plan

## 6. Dependencias
- classPlanRepository existente
- ClassPlan interface en domain.ts
- studentRepository
- classTypeRepository

## 7. Riesgos
- Ninguno significativo
