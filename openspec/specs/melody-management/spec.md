# Melody Management Specification

## Purpose
Organizar y centralizar el material didáctico musical del profesor, permitiendo su asociación con alumnos y planes de clase.

## Requirements

### Requirement: Melody Cataloging
El sistema DEBE permitir crear, editar y categorizar melodías con metadatos técnicos (tonalidad, tempo, rango).

#### Scenario: Categorización de nueva melodía
- GIVEN un profesor en la Biblioteca
- WHEN crea una melodía y selecciona categoría "Escala"
- THEN el sistema guarda el registro asociado a esa categoría
- AND se muestra correctamente en la grilla filtrada.

### Requirement: Audio Integration
El sistema DEBE permitir adjuntar y reproducir un archivo de audio para cada melodía.

#### Scenario: Reproducción de audio
- GIVEN una melodía con un archivo de audio subido
- WHEN el profesor presiona el botón de "Reproducir" en la tarjeta
- THEN el sistema DEBE cargar el audio desde el Storage
- AND iniciar la reproducción sin errores.

### Requirement: Technical Objective Documentation
El sistema DEBE permitir documentar objetivos técnicos específicos para cada recurso.

#### Scenario: Consulta de objetivo
- GIVEN una melodía existente
- WHEN el profesor visualiza la tarjeta de la melodía
- THEN el sistema DEBE mostrar el bloque "Objetivo Técnico" con la descripción guardada.
