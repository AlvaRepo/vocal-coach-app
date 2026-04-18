import { SupabaseRepository } from '@/shared/api/supabase-repository';
import type { Student, ClassType, Note, Melody, ClassPlan, ClassRecord, ProgressEntry, AttendanceRecord } from '@/shared/types/domain';

export const studentRepository = new SupabaseRepository<Student>('students');
export const classTypeRepository = new SupabaseRepository<ClassType>('class_types');
export const noteRepository = new SupabaseRepository<Note>('notes');
export const melodyRepository = new SupabaseRepository<Melody>('melodies');
export const classPlanRepository = new SupabaseRepository<ClassPlan>('class_plans');
export const classRecordRepository = new SupabaseRepository<ClassRecord>('class_records');
export const progressRepository = new SupabaseRepository<ProgressEntry>('progress_entries');
export const attendanceRepository = new SupabaseRepository<AttendanceRecord>('attendance_records');
