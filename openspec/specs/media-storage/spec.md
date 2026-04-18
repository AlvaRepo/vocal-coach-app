# Media Storage Specification

## Purpose
Gestionar el ciclo de vida de los archivos de audio y recursos externos, asegurando su persistencia en Supabase Storage y su disponibilidad para la aplicación.

## Requirements

### Requirement: File Upload
El sistema DEBE permitir la subida de archivos de audio desde el frontend al bucket `melodies`.

#### Scenario: Subida exitosa
- GIVEN un archivo de audio válido (MP3/WAV) y una sesión de usuario activa
- WHEN el usuario selecciona el archivo y guarda el formulario
- THEN el sistema DEBE subir el archivo a Supabase Storage
- AND DEBE retornar el `path` o `publicUrl` resultante.

#### Scenario: Validación de tipo de archivo
- GIVEN un archivo que NO es de audio (ej: PDF o EXE)
- WHEN el usuario intenta seleccionarlo para una melodía
- THEN el sistema DEBE rechazar el archivo y mostrar un error de validación ("Formato no soportado").

### Requirement: Media Retrieval
El sistema DEBE ser capaz de recuperar y servir archivos de audio de forma segura.

#### Scenario: Obtención de URL pública
- GIVEN una melodía guardada con una referencia de audio válida
- WHEN el sistema carga la interfaz de la biblioteca
- THEN el sistema DEBE generar una URL de acceso para el archivo de Supabase Storage para alimentar el reproductor.
