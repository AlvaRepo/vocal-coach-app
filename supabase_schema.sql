-- Script de creación de tablas para Vocal Coach Admin (Versión Corregida)
-- Verificado con documentación de Supabase

-- Habilitar extensiones necesarias para generación de UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Alumnos (Students)
CREATE TABLE IF NOT EXISTS public.students (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text,
    phone text,
    type text CHECK (type IN ('private', 'choir', 'both')) DEFAULT 'private',
    status text CHECK (status IN ('active', 'paused', 'graduated', 'inactive')) DEFAULT 'active',
    join_date date DEFAULT CURRENT_DATE,
    birth_date date,
    vocal_range text,
    level text CHECK (level IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
    goals text,
    general_observations text,
    important_alerts text[] DEFAULT '{}',
    technical_assessment jsonb DEFAULT '{}',
    tags text[] DEFAULT '{}',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 2. Tipos de Clases (Class Types)
CREATE TABLE IF NOT EXISTS public.class_types (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    description text,
    suggested_duration integer DEFAULT 60,
    objectives text[] DEFAULT '{}',
    structure text,
    resources text[] DEFAULT '{}',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 3. Melodías / Ejercicios (Melodies)
CREATE TABLE IF NOT EXISTS public.melodies (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    category text CHECK (category IN ('warmup', 'scale', 'exercise', 'repertoire', 'other')) DEFAULT 'exercise',
    key text,
    range text,
    tempo text,
    difficulty text CHECK (difficulty IN ('easy', 'medium', 'hard')) DEFAULT 'medium',
    technical_objective text,
    description text,
    teacher_notes text,
    is_favorite boolean DEFAULT false,
    audio_file_reference text,
    tags text[] DEFAULT '{}',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- ==========================================
-- POLÍTICAS DE SEGURIDAD (RLS)
-- ==========================================

-- Habilitar RLS en todas las tablas
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.melodies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;

-- Crear políticas básicas para usuarios autenticados (Admin)
-- Como es un Admin Panel, el usuario autenticado tiene acceso total.

CREATE POLICY "Allow authenticated full access" ON public.students FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated full access" ON public.class_types FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated full access" ON public.melodies FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated full access" ON public.notes FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated full access" ON public.class_plans FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated full access" ON public.class_records FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated full access" ON public.progress_entries FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated full access" ON public.attendance_records FOR ALL TO authenticated USING (true);

-- 4. Notas (Notes)
CREATE TABLE IF NOT EXISTS public.notes (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id uuid REFERENCES public.students(id) ON DELETE CASCADE,
    type text CHECK (type IN ('quick', 'detailed', 'class', 'general', 'private')) DEFAULT 'general',
    category text,
    title text NOT NULL,
    content text NOT NULL,
    tags text[] DEFAULT '{}',
    is_pinned boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 5. Planes de Clase (Class Plans)
CREATE TABLE IF NOT EXISTS public.class_plans (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id uuid REFERENCES public.students(id) ON DELETE SET NULL,
    class_type_id uuid REFERENCES public.class_types(id) ON DELETE SET NULL,
    title text NOT NULL,
    status text CHECK (status IN ('draft', 'ready', 'completed', 'cancelled')) DEFAULT 'draft',
    date timestamptz,
    duration integer DEFAULT 60,
    objective text,
    warm_up text,
    technical_exercises text[] DEFAULT '{}',
    scales text[] DEFAULT '{}',
    anticipated_difficulties text,
    observations text,
    homework text,
    materials text[] DEFAULT '{}',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 6. Registros de Clases Realizadas (Class Records)
CREATE TABLE IF NOT EXISTS public.class_records (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id uuid REFERENCES public.students(id) ON DELETE SET NULL,
    class_plan_id uuid REFERENCES public.class_plans(id) ON DELETE SET NULL,
    date timestamptz DEFAULT now(),
    actual_duration integer,
    topics_covered text[] DEFAULT '{}',
    student_feedback text,
    teacher_observations text,
    next_steps text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 7. Entradas de Progreso (Progress Entries)
CREATE TABLE IF NOT EXISTS public.progress_entries (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id uuid REFERENCES public.students(id) ON DELETE CASCADE,
    date date DEFAULT current_date,
    category text NOT NULL,
    score integer CHECK (score BETWEEN 1 AND 5),
    notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 8. Asistencia (Attendance)
CREATE TABLE IF NOT EXISTS public.attendance_records (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id uuid REFERENCES public.students(id) ON DELETE CASCADE,
    date date DEFAULT current_date,
    status text check (status in ('present', 'absent', 'late', 'justified')) DEFAULT 'present',
    notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);
