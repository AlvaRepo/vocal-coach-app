// features/classes/schemas/class-plan-form.schema.ts

import { z } from 'zod';

export const classPlanFormSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  studentId: z.string().min(1, 'Debe seleccionar un estudiante'),
  classTypeId: z.string().optional(),
  date: z.string().optional(),
  time: z.string().optional(),
  duration: z.coerce.number().min(15, 'Duración mínima 15 minutos').max(180, 'Duración máxima 180 minutos').optional(),
  objective: z.string().optional(),
  exercises: z.string().optional(),
  warmup: z.string().optional(),
  repertoire: z.string().optional(),
  difficultiesExpected: z.string().optional(),
  observations: z.string().optional(),
  status: z.enum(['draft', 'ready', 'completed', 'cancelled']).default('draft'),
});

export type ClassPlanFormData = z.infer<typeof classPlanFormSchema>;
