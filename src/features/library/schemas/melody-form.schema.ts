// features/library/schemas/melody-form.schema.ts

import { z } from 'zod';

export const melodyFormSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().optional(),
  
  category: z.enum(['scale', 'exercise', 'warmup', 'repertoire'], {
    required_error: 'Debe seleccionar una categoría',
  }),
  
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  key: z.string().optional(),
  range: z.string().optional(),
  tempo: z.string().optional(),
  technicalObjective: z.string().optional(),
  teacherNotes: z.string().optional(),
  tags: z.string().optional(), // Se convertirá a array
  audioFileReference: z.string().optional(),
});

export type MelodyFormData = z.infer<typeof melodyFormSchema>;
