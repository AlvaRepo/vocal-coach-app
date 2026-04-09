// entities/class-type/repository.ts

import { LocalStorageRepository } from '@/shared/api/local-storage';
import type { ClassType } from '@/shared/types/domain';

export const classTypeRepository = new LocalStorageRepository<ClassType>('classTypes');

// entities/note/repository.ts
import type { Note } from '@/shared/types/domain';

export const noteRepository = new LocalStorageRepository<Note>('notes');

// entities/melody/repository.ts
import type { Melody } from '@/shared/types/domain';

export const melodyRepository = new LocalStorageRepository<Melody>('melodies');

// entities/class-plan/repository.ts
import type { ClassPlan } from '@/shared/types/domain';

export const classPlanRepository = new LocalStorageRepository<ClassPlan>('classPlans');

// entities/class-record/repository.ts
import type { ClassRecord } from '@/shared/types/domain';

export const classRecordRepository = new LocalStorageRepository<ClassRecord>('classRecords');

// entities/progress/repository.ts
import type { ProgressEntry } from '@/shared/types/domain';

export const progressRepository = new LocalStorageRepository<ProgressEntry>('progressEntries');

// entities/attendance/repository.ts
import type { AttendanceRecord } from '@/shared/types/domain';

export const attendanceRepository = new LocalStorageRepository<AttendanceRecord>('attendanceRecords');
