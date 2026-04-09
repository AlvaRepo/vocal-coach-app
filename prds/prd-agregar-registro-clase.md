# PRD: Agregar Registro de Clase - ClassRecordsPage

## 1. Overview
Registrar la asistencia y progreso de cada clase tomada por un estudiante.

## 2. Problema
El botón está deshabilitado. No se puede registrar qué clases se tomaron.

## 3. Solución
Formulario para registrar:
- Estudiante (requerido)
- Tipo de clase
- Fecha
- Duración real
- Asistencia: presente, ausente, reprogramado
- Progreso del estudiante (notas)
- Adjuntos/recursos usados

## 4. Alcance
- **In Scope**: Registro de asistencia, notas post-clase
- **Out of Scope**: Reportes, estadísticas

## 5. Criterios de Aceptación
- [ ] Botón habilitado
- [ ] Selector de estudiante
- [ ] Registro de asistencia
- [ ] Notas post-clase
- [ ] Guardar en classRecordRepository
- [ ] Lista de registros por estudiante

## 6. Dependencias
- classRecordRepository existente
- ClassRecord interface en domain.ts
- studentRepository

## 7. Riesgos
- Ninguno significativo
