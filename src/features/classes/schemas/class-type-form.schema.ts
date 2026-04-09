// features/classes/schemas/class-type-form.schema.ts

import { z } from 'zod';

export const classTypeFormSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().optional(),
  suggestedDuration: z.coerce.number().min(15, 'Duración mínima 15 minutos').max(180, 'Duración máxima 180 minutos'),
  objectives: z.string().optional(), // Se convertirá a array
  structure: z.string().optional(),
});

export type ClassTypeFormData = z.infer<typeof classTypeFormSchema>;
