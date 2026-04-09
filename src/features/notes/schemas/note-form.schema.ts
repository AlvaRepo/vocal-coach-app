// features/notes/schemas/note-form.schema.ts

import { z } from 'zod';

export const noteFormSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  content: z.string().min(1, 'El contenido es requerido'),
  
  type: z.enum(['quick', 'detailed', 'class', 'general', 'private'], {
    required_error: 'Debe seleccionar un tipo de nota',
  }),
  
  category: z.string().optional(),
  studentId: z.string().optional(),
  classRecordId: z.string().optional(),
  tags: z.string().optional(),
  isPinned: z.boolean().optional(),
});

export type NoteFormData = z.infer<typeof noteFormSchema>;
