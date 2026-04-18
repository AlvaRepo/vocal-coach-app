# User Authentication Specification

## Purpose
Asegurar que solo los usuarios autorizados (profesores) puedan acceder a los datos de los alumnos y las melodías, gestionando la sesión de forma persistente.

## Requirements

### Requirement: Authentication Flow
El sistema DEBE permitir a los usuarios iniciar sesión mediante Email y Contraseña a través de Supabase Auth.

#### Scenario: Login exitoso
- GIVEN un usuario registrado en Supabase
- WHEN ingresa su email y contraseña correctos en la `/login`
- THEN el sistema lo redirige al Dashboard (`/`)
- AND se muestra un mensaje de bienvenida.

#### Scenario: Login fallido
- GIVEN un usuario con credenciales incorrectas
- WHEN intenta iniciar sesión
- THEN el sistema muestra un mensaje de error claro ("Credenciales inválidas")
- AND el usuario permanece en la página de `/login`.

### Requirement: Protected Routes
El sistema DEBE denegar el acceso a toda ruta privada si no hay una sesión activa.

#### Scenario: Acceso no autorizado
- GIVEN un usuario anónimo (sin sesión)
- WHEN intenta navegar a `/notes` o `/students`
- THEN el sistema lo redirige automáticamente a `/login`.

### Requirement: Session Persistence
El sistema DEBE mantener la sesión activa tras recargar el navegador.

#### Scenario: Persistencia tras refresh
- GIVEN un usuario logueado en la aplicación
- WHEN el usuario presiona F5 o cierra y abre la pestaña
- THEN el sistema DEBE recuperar la sesión de Supabase automáticamente y mantener al usuario en la página actual.
