// entities/student/repository.ts

import { SupabaseRepository } from '@/shared/api/supabase-repository';
import type { Student } from '@/shared/types/domain';

export const studentRepository = new SupabaseRepository<Student>('students');
