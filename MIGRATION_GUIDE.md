# 🔄 Guía de Migración a Backend

Esta guía explica paso a paso cómo migrar la aplicación de **localStorage** a un **backend real** con persistencia en base de datos.

---

## 📋 Índice

1. [Visión General](#visión-general)
2. [Fase 1: Backend Setup](#fase-1-backend-setup)
3. [Fase 2: API Implementation](#fase-2-api-implementation)
4. [Fase 3: Frontend Migration](#fase-3-frontend-migration)
5. [Fase 4: Authentication](#fase-4-authentication)
6. [Fase 5: Advanced Features](#fase-5-advanced-features)
6. [Checklist de Migración](#checklist-de-migración)

---

## Visión General

### ¿Qué NO cambia?

✅ **Interfaz `IRepository<T>`** - Se mantiene igual  
✅ **Tipos de dominio** - `Student`, `ClassType`, etc.  
✅ **Lógica de features** - Componentes, hooks  
✅ **UI Components** - shadcn/ui  
✅ **Schemas Zod** - Validación de formularios  

### ¿Qué SÍ cambia?

🔄 **Repository implementations** - localStorage → HTTP  
🔄 **Estado de loading** - Necesario para network requests  
🆕 **Autenticación** - Login/logout/refresh tokens  
🆕 **Error handling** - Network errors, retries  
🆕 **Optimistic updates** - UI responsive  
🆕 **Cache strategy** - React Query / SWR  

---

## Fase 1: Backend Setup

### 1.1. Elegir Stack Backend

**Opción A: Node.js + Express + Prisma**
```bash
# Estructura recomendada
backend/
├── src/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── middleware/
│   └── prisma/
│       └── schema.prisma
├── package.json
└── tsconfig.json
```

**Opción B: Node.js + NestJS + TypeORM**
```bash
# NestJS tiene estructura más opinada
backend/
├── src/
│   ├── students/
│   │   ├── students.controller.ts
│   │   ├── students.service.ts
│   │   ├── students.entity.ts
│   │   └── students.module.ts
│   └── app.module.ts
```

**Opción C: Next.js API Routes**
```bash
# Si quieres mantener monorepo
app/
├── api/
│   ├── students/
│   │   └── route.ts
│   └── auth/
│       └── route.ts
```

### 1.2. Database Setup

**Prisma Schema Example:**

```prisma
// prisma/schema.prisma

model Student {
  id                  String    @id @default(cuid())
  firstName           String
  lastName            String
  email               String?
  phone               String?
  birthDate           DateTime?
  
  type                StudentType
  status              StudentStatus
  joinDate            DateTime
  
  vocalRange          VocalRange?
  level               StudentLevel?
  
  goals               String?   @db.Text
  generalObservations String?   @db.Text
  importantAlerts     String[]
  
  technicalAssessment Json?
  tags                String[]
  
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
  
  // Relations
  classPlans          ClassPlan[]
  classRecords        ClassRecord[]
  notes               Note[]
  progressEntries     ProgressEntry[]
  attendanceRecords   AttendanceRecord[]
  
  @@index([status])
  @@index([type])
  @@index([email])
}

enum StudentType {
  CHOIR
  PRIVATE
  BOTH
}

enum StudentStatus {
  ACTIVE
  PAUSED
  GRADUATED
  ARCHIVED
}

enum VocalRange {
  SOPRANO
  MEZZO
  ALTO
  TENOR
  BARITONE
  BASS
  UNDEFINED
}

enum StudentLevel {
  BEGINNER
  INTERMEDIATE
  ADVANCED
}

// ... otros modelos
```

### 1.3. Crear API Endpoints

**Ejemplo con Express:**

```typescript
// routes/students.routes.ts
import { Router } from 'express';
import { StudentsController } from '../controllers/students.controller';

const router = Router();
const controller = new StudentsController();

router.get('/students', controller.getAll);
router.get('/students/:id', controller.getById);
router.post('/students', controller.create);
router.put('/students/:id', controller.update);
router.delete('/students/:id', controller.delete);
router.get('/students/search', controller.search);

export default router;
```

**Controller Example:**

```typescript
// controllers/students.controller.ts
import { Request, Response } from 'express';
import { StudentsService } from '../services/students.service';
import { z } from 'zod';
import { studentFormSchema } from '../schemas/student.schema';

export class StudentsController {
  private service = new StudentsService();

  getAll = async (req: Request, res: Response) => {
    try {
      const students = await this.service.findAll();
      res.json(students);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const student = await this.service.findById(id);
      
      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }
      
      res.json(student);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      // Validar con Zod
      const data = studentFormSchema.parse(req.body);
      const student = await this.service.create(data);
      res.status(201).json(student);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // ... más métodos
}
```

---

## Fase 2: API Implementation

### 2.1. Migrar Datos de localStorage a DB

**Script de migración:**

```typescript
// scripts/migrate-localStorage-to-db.ts
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function migrate() {
  // 1. Exportar datos desde frontend (localStorage)
  // Usuario hace: Settings → Exportar datos
  // Genera: backup.json
  
  // 2. Leer backup.json
  const backup = JSON.parse(fs.readFileSync('./backup.json', 'utf-8'));
  
  // 3. Insertar en DB
  console.log('Migrando students...');
  for (const student of backup.students) {
    await prisma.student.create({
      data: {
        ...student,
        // Transformar campos si es necesario
        birthDate: student.birthDate ? new Date(student.birthDate) : null,
        joinDate: new Date(student.joinDate),
      },
    });
  }
  
  console.log('Migrando classTypes...');
  for (const classType of backup.classTypes) {
    await prisma.classType.create({ data: classType });
  }
  
  // ... resto de entidades
  
  console.log('✅ Migración completada');
}

migrate()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

### 2.2. Implementar Autenticación

**JWT Strategy:**

```typescript
// middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId?: string;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
```

**Login Endpoint:**

```typescript
// routes/auth.routes.ts
router.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Validar credenciales
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // Generar tokens
  const accessToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET!,
    { expiresIn: '15m' }
  );
  
  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.REFRESH_SECRET!,
    { expiresIn: '7d' }
  );
  
  res.json({ accessToken, refreshToken, user });
});
```

---

## Fase 3: Frontend Migration

### 3.1. Crear HttpRepository

```typescript
// shared/api/http-repository.ts
import type { IRepository } from './base';

interface HttpConfig {
  baseUrl: string;
  getToken?: () => string | null;
}

export class HttpRepository<T extends { id: string }> implements IRepository<T> {
  constructor(private config: HttpConfig) {}
  
  private async fetch(endpoint: string, options: RequestInit = {}) {
    const token = this.config.getToken?.();
    
    const response = await fetch(`${this.config.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  async getAll(): Promise<T[]> {
    return this.fetch('');
  }
  
  async getById(id: string): Promise<T | null> {
    try {
      return await this.fetch(`/${id}`);
    } catch (error) {
      return null;
    }
  }
  
  async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    return this.fetch('', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
  
  async update(id: string, data: Partial<T>): Promise<T> {
    return this.fetch(`/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
  
  async delete(id: string): Promise<void> {
    await this.fetch(`/${id}`, { method: 'DELETE' });
  }
  
  async query(filters: Record<string, any>): Promise<T[]> {
    const params = new URLSearchParams(filters as any);
    return this.fetch(`?${params}`);
  }
  
  async search(searchTerm: string): Promise<T[]> {
    return this.fetch(`/search?q=${encodeURIComponent(searchTerm)}`);
  }
}
```

### 3.2. Actualizar Repositories

```typescript
// entities/student/repository.ts

// ANTES
import { LocalStorageRepository } from '@/shared/api/local-storage';
export const studentRepository = new LocalStorageRepository<Student>('students');

// DESPUÉS
import { HttpRepository } from '@/shared/api/http-repository';
import { getAuthToken } from '@/shared/lib/auth';

export const studentRepository = new HttpRepository<Student>({
  baseUrl: '/api/students',
  getToken: getAuthToken,
});
```

### 3.3. Auth Store con Zustand

```typescript
// shared/stores/auth-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthStore {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      
      login: async (email, password) => {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        
        if (!response.ok) {
          throw new Error('Login failed');
        }
        
        const data = await response.json();
        set({
          user: data.user,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        });
      },
      
      logout: () => {
        set({ user: null, accessToken: null, refreshToken: null });
      },
      
      refreshAccessToken: async () => {
        const { refreshToken } = get();
        if (!refreshToken) throw new Error('No refresh token');
        
        const response = await fetch('/api/auth/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });
        
        const data = await response.json();
        set({ accessToken: data.accessToken });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

export const getAuthToken = () => useAuthStore.getState().accessToken;
```

### 3.4. Protected Routes

```typescript
// app/components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/shared/stores/auth-store';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = useAuthStore(state => state.user);
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

// Actualizar router.tsx
{
  path: '/',
  element: <ProtectedRoute><AppLayout /></ProtectedRoute>,
  children: [...]
}
```

---

## Fase 4: Authentication

### 4.1. Login Page

```typescript
// features/auth/pages/LoginPage.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/shared/stores/auth-store';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/shared/components/ui/form';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);
  
  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });
  
  async function onSubmit(data: LoginForm) {
    try {
      await login(data.email, data.password);
      toast.success('Inicio de sesión exitoso');
      navigate('/');
    } catch (error) {
      toast.error('Credenciales inválidas');
    }
  }
  
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Vocal Coach Admin</h1>
          <p className="text-muted-foreground">Inicia sesión en tu cuenta</p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full">
              Iniciar Sesión
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
```

### 4.2. Token Refresh Interceptor

```typescript
// shared/api/http-interceptor.ts
import { useAuthStore } from '@/shared/stores/auth-store';

let isRefreshing = false;
let refreshQueue: Array<() => void> = [];

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = useAuthStore.getState().accessToken;
  
  let response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  
  // Si token expiró, refresh
  if (response.status === 401 && !isRefreshing) {
    isRefreshing = true;
    
    try {
      await useAuthStore.getState().refreshAccessToken();
      
      // Retry request original
      const newToken = useAuthStore.getState().accessToken;
      response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${newToken}`,
        },
      });
      
      // Ejecutar requests en queue
      refreshQueue.forEach(cb => cb());
      refreshQueue = [];
    } catch (error) {
      // Refresh falló, logout
      useAuthStore.getState().logout();
      window.location.href = '/login';
    } finally {
      isRefreshing = false;
    }
  }
  
  return response;
}
```

---

## Fase 5: Advanced Features

### 5.1. React Query para Cache

```typescript
// Instalar
npm install @tanstack/react-query

// shared/lib/query-client.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      cacheTime: 10 * 60 * 1000, // 10 minutos
      refetchOnWindowFocus: false,
    },
  },
});

// features/students/hooks/useStudents.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentRepository } from '@/entities/student/repository';

export function useStudents() {
  return useQuery({
    queryKey: ['students'],
    queryFn: () => studentRepository.getAll(),
  });
}

export function useStudent(id: string) {
  return useQuery({
    queryKey: ['students', id],
    queryFn: () => studentRepository.getById(id),
  });
}

export function useCreateStudent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: studentRepository.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
}
```

### 5.2. Optimistic Updates

```typescript
export function useUpdateStudent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Student> }) =>
      studentRepository.update(id, data),
    
    onMutate: async ({ id, data }) => {
      // Cancel queries en progreso
      await queryClient.cancelQueries({ queryKey: ['students', id] });
      
      // Snapshot del estado anterior
      const previousStudent = queryClient.getQueryData(['students', id]);
      
      // Optimistic update
      queryClient.setQueryData(['students', id], (old: Student) => ({
        ...old,
        ...data,
      }));
      
      return { previousStudent };
    },
    
    onError: (err, variables, context) => {
      // Rollback en caso de error
      if (context?.previousStudent) {
        queryClient.setQueryData(
          ['students', variables.id],
          context.previousStudent
        );
      }
    },
    
    onSettled: (data, error, variables) => {
      // Refetch para sincronizar
      queryClient.invalidateQueries({ queryKey: ['students', variables.id] });
    },
  });
}
```

### 5.3. File Upload para Audio

```typescript
// API endpoint
router.post('/melodies/:id/audio', upload.single('audio'), async (req, res) => {
  const { id } = req.params;
  const file = req.file;
  
  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  // Upload a S3/Cloudinary
  const audioUrl = await uploadToCloud(file);
  
  // Update melody
  await prisma.melody.update({
    where: { id },
    data: { audioUrl },
  });
  
  res.json({ audioUrl });
});

// Frontend
export async function uploadMelodyAudio(melodyId: string, file: File) {
  const formData = new FormData();
  formData.append('audio', file);
  
  const response = await fetchWithAuth(`/api/melodies/${melodyId}/audio`, {
    method: 'POST',
    body: formData,
  });
  
  return response.json();
}
```

---

## Checklist de Migración

### Backend
- [ ] Setup backend (Express/NestJS/Next.js API)
- [ ] Database schema (Prisma/TypeORM)
- [ ] Migrate seed data a DB
- [ ] API endpoints para todas las entidades
- [ ] Autenticación (JWT)
- [ ] Middleware de validación
- [ ] Error handling
- [ ] Rate limiting
- [ ] CORS configuration

### Frontend
- [ ] Crear `HttpRepository<T>`
- [ ] Actualizar todos los repositories
- [ ] Implementar auth store
- [ ] Crear LoginPage
- [ ] Protected routes
- [ ] Token refresh logic
- [ ] Loading states globales
- [ ] Error boundaries
- [ ] Offline detection

### Advanced
- [ ] React Query setup
- [ ] Optimistic updates
- [ ] Cache invalidation strategy
- [ ] File upload (audio)
- [ ] Push notifications
- [ ] Email service
- [ ] Calendar sync (Google/Outlook)
- [ ] Analytics tracking

### Testing & Deploy
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests
- [ ] CI/CD pipeline
- [ ] Staging environment
- [ ] Production deployment
- [ ] Monitoring (Sentry)
- [ ] Performance tracking

---

## 🎯 Resultado Final

Después de la migración:

✅ **Multi-dispositivo**: Sync automático  
✅ **Offline-first**: Cache con React Query  
✅ **Real-time**: WebSockets (opcional)  
✅ **Escalable**: Arquitectura lista para crecer  
✅ **Seguro**: Auth + validación server-side  
✅ **Rápido**: Optimistic updates + cache inteligente  

**Y todo sin reescribir el frontend desde cero.** 🚀

---

¿Preguntas? Revisa los comentarios `🔴 PLACEHOLDER` en el código para detalles técnicos específicos de cada módulo.
