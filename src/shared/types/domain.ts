// shared/types/domain.ts - Modelos de dominio de la aplicación

export type StudentStatus = 'active' | 'paused' | 'graduated' | 'archived';
export type StudentType = 'choir' | 'private' | 'both';
export type VocalRange = 'soprano' | 'mezzo' | 'alto' | 'tenor' | 'baritone' | 'bass' | 'undefined';
export type SkillLevel = 1 | 2 | 3 | 4 | 5; // 1=principiante, 5=avanzado
export type StudentLevel = 'beginner' | 'intermediate' | 'advanced';

export interface TechnicalAssessment {
  pitch?: SkillLevel;
  breathing?: SkillLevel;
  projection?: SkillLevel;
  diction?: SkillLevel;
  rhythm?: SkillLevel;
  interpretation?: SkillLevel;
  stagePresence?: SkillLevel;
  commitment?: SkillLevel;
}

export interface Student {
  id: string;
  
  // Datos básicos
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  photoUrl?: string; // URL de foto del estudiante
  birthDate?: string; // ISO date string
  
  // Tipo y estado
  type: StudentType;
  status: StudentStatus;
  joinDate: string; // ISO date string
  
  // Clasificación vocal
  vocalRange?: VocalRange;
  level?: StudentLevel;
  
  // Objetivos y notas
  goals?: string;
  generalObservations?: string;
  importantAlerts?: string[];
  
  // Evaluación técnica (1-5)
  technicalAssessment?: TechnicalAssessment;
  
  // Metadata
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export type ClassStatus = 'draft' | 'ready' | 'completed' | 'cancelled';

export interface ClassType {
  id: string;
  name: string;
  description?: string;
  suggestedDuration: number; // minutos
  objectives?: string[];
  structure?: string; // Template base de la clase
  resources?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ClassPlan {
  id: string;
  title: string;
  studentId?: string; // null = grupal
  studentIds?: string[]; // Para clases grupales
  classTypeId?: string;
  
  date?: string; // ISO date string
  duration?: number;
  status: ClassStatus;
  
  // Contenido
  objective?: string;
  warmUp?: string;
  technicalExercises?: string[];
  scales?: string[];
  repertoire?: string[];
  anticipatedDifficulties?: string;
  observations?: string;
  homework?: string;
  materials?: string[];
  
  createdAt: string;
  updatedAt: string;
}

export interface ClassRecord {
  id: string;
  planId?: string; // Referencia a plan si existe
  studentId?: string;
  studentIds?: string[];
  classTypeId?: string;
  
  date: string; // ISO date string
  duration: number;
  attendance?: 'attended' | 'absent' | 'cancelled' | 'rescheduled';
  
  // Qué pasó
  topicsWorkedOn: string[];
  exercisesPerformed: string[];
  results?: string;
  whatWentWell?: string;
  whatNeedsWork?: string;
  nextSteps?: string;
  homework?: string;
  
  // Evaluación rápida de progreso en esta sesión
  progressNotes?: string;
  
  teacherNotes?: string;
  
  createdAt: string;
  updatedAt: string;
}

export type NoteType = 'quick' | 'detailed' | 'class' | 'general' | 'private';

export interface Note {
  id: string;
  type: NoteType;
  category?: string;
  
  studentId?: string; // null = nota general del profesor
  classRecordId?: string;
  
  title?: string;
  content: string;
  
  tags?: string[];
  isPinned?: boolean;
  
  createdAt: string;
  updatedAt: string;
}

export interface ProgressAreaAssessment {
  pitch?: SkillLevel;
  breathing?: SkillLevel;
  technique?: SkillLevel;
  memory?: SkillLevel;
  interpretation?: SkillLevel;
  diction?: SkillLevel;
  rhythm?: SkillLevel;
  posture?: SkillLevel;
  stageConfidence?: SkillLevel;
}

export interface ProgressEntry {
  id: string;
  studentId: string;
  date: string; // ISO date string
  
  // Áreas evaluadas (1-5)
  areas: ProgressAreaAssessment;
  
  notes?: string;
  milestonesAchieved?: string[];
  
  createdAt: string;
  updatedAt: string;
}

export type MelodyCategory = 'scale' | 'exercise' | 'warmup' | 'repertoire';
export type MelodyDifficulty = 'easy' | 'medium' | 'hard';

export interface Melody {
  id: string;
  name: string;
  category: MelodyCategory;
  
  // Características
  key?: string; // tonalidad
  range?: string; // rango: Do3-Sol4
  tempo?: string;
  difficulty?: MelodyDifficulty;
  technicalObjective?: string;
  
  // Asociaciones
  studentIds?: string[]; // A qué alumnos está asignado
  classTypeIds?: string[];
  
  /**
   * 🔴 PLACEHOLDER: Migración futura requerirá campo audioUrl (cloud storage)
   * Por ahora: audioFileReference es una referencia local o null
   * 
   * MIGRACIÓN FUTURA:
   * 1. Implementar upload a cloud storage (S3/Cloudinary/Supabase)
   * 2. Agregar campo audioUrl: string
   * 3. Implementar reproductor de audio
   * 4. Features avanzadas: transposición, ajuste de tempo, grabación
   */
  audioFileReference?: string;
  
  description?: string;
  teacherNotes?: string;
  
  tags?: string[];
  isFavorite?: boolean;
  
  createdAt: string;
  updatedAt: string;
}

export type AttendanceStatus = 'attended' | 'absent' | 'cancelled' | 'rescheduled';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string; // ISO date string
  status: AttendanceStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppConfig {
  classTypes: ClassType[];
  levels: string[];
  tags: string[];
  noteCategories: string[];
  evaluationOptions: string[];
  templates: {
    classPlans: Partial<ClassPlan>[];
  };
}
