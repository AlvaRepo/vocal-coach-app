// features/students/schemas/student-form.schema.ts

import { z } from 'zod';

export const studentFormSchema = z.object({
  firstName: z.string().min(1, 'El nombre es requerido'),
  lastName: z.string().min(1, 'El apellido es requerido'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().optional(),
  photoUrl: z.string().url('URL inválida').optional().or(z.literal('')),
  birthDate: z.string().optional(),
  
  type: z.enum(['choir', 'private', 'both'], {
    required_error: 'Debe seleccionar un tipo de alumno',
  }),
  status: z.enum(['active', 'paused', 'graduated', 'archived']),
  joinDate: z.string().min(1, 'La fecha de ingreso es requerida'),
  
  vocalRange: z.enum(['soprano', 'mezzo', 'alto', 'tenor', 'baritone', 'bass', 'undefined']).optional(),
  level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  
  goals: z.string().optional(),
  generalObservations: z.string().optional(),
  importantAlerts: z.string().optional(), // Se convertirá a array
  
  tags: z.string().optional(), // Se convertirá a array
});

export type StudentFormData = z.infer<typeof studentFormSchema>;
