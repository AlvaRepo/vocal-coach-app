// features/classes/schemas/class-record-form.schema.ts

import { z } from 'zod';

export const classRecordFormSchema = z.object({
  studentId: z.string().min(1, 'Debe seleccionar un estudiante'),
  classTypeId: z.string().optional(),
  date: z.string().min(1, 'La fecha es requerida'),
  duration: z.coerce.number().min(15, 'Duración mínima 15 minutos').max(180, 'Duración máxima 180 minutos'),
  attendance: z.enum(['attended', 'absent', 'cancelled', 'rescheduled'], {
    required_error: 'Debe seleccionar el estado de asistencia',
  }),
  topicsWorkedOn: z.string().optional(),
  exercisesPerformed: z.string().optional(),
  results: z.string().optional(),
  whatWentWell: z.string().optional(),
  whatNeedsWork: z.string().optional(),
  nextSteps: z.string().optional(),
  homework: z.string().optional(),
  progressNotes: z.string().optional(),
  teacherNotes: z.string().optional(),
});

export type ClassRecordFormData = z.infer<typeof classRecordFormSchema>;
