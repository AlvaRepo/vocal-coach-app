// shared/lib/seed-data.ts

import { nanoid } from 'nanoid';
import type { Student, ClassType, Note, Melody, ClassPlan } from '@/shared/types/domain';

const now = new Date().toISOString();

/**
 * Datos semilla para alumnos
 * Variedad de perfiles, niveles y estados
 */
export const SEED_STUDENTS: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    firstName: 'María',
    lastName: 'González',
    email: 'maria.gonzalez@example.com',
    phone: '+54 9 387 123-4567',
    type: 'both',
    status: 'active',
    joinDate: '2024-01-15',
    vocalRange: 'soprano',
    level: 'intermediate',
    goals: 'Mejorar proyección vocal y prepararse para audición de coro profesional. Trabajar especialmente en el registro de cabeza.',
    generalObservations: 'Alumna muy comprometida, practica regularmente. Tiene buena musicalidad natural.',
    technicalAssessment: {
      pitch: 4,
      breathing: 3,
      projection: 3,
      diction: 4,
      rhythm: 4,
      interpretation: 3,
      stagePresence: 3,
      commitment: 5
    },
    tags: ['coro-principal', 'clases-martes', 'repertorio-clasico']
  },
  {
    firstName: 'Juan',
    lastName: 'Fernández',
    email: 'juan.fernandez@example.com',
    type: 'private',
    status: 'active',
    joinDate: '2023-08-20',
    vocalRange: 'tenor',
    level: 'advanced',
    goals: 'Perfeccionar técnica para presentación en teatro municipal. Ampliar rango agudo.',
    generalObservations: 'Tiene experiencia previa. Excelente control respiratorio pero necesita trabajar interpretación.',
    importantAlerts: ['Disponibilidad limitada por trabajo - solo jueves y viernes'],
    technicalAssessment: {
      pitch: 5,
      breathing: 5,
      projection: 4,
      diction: 4,
      rhythm: 5,
      interpretation: 3,
      stagePresence: 4,
      commitment: 4
    },
    tags: ['avanzado', 'teatro', 'repertorio-opera']
  },
  {
    firstName: 'Ana',
    lastName: 'Martínez',
    email: 'ana.martinez@example.com',
    phone: '+54 9 387 234-5678',
    type: 'choir',
    status: 'active',
    joinDate: '2024-03-10',
    vocalRange: 'alto',
    level: 'beginner',
    goals: 'Aprender fundamentos de canto coral. Ganar confianza para cantar en grupo.',
    generalObservations: 'Primera experiencia cantando. Muy entusiasta pero aún tímida.',
    technicalAssessment: {
      pitch: 2,
      breathing: 2,
      projection: 2,
      diction: 3,
      rhythm: 3,
      interpretation: 2,
      stagePresence: 2,
      commitment: 4
    },
    tags: ['coro-iniciantes', 'clases-sabado']
  },
  {
    firstName: 'Carlos',
    lastName: 'Rodríguez',
    type: 'both',
    status: 'paused',
    joinDate: '2023-05-12',
    vocalRange: 'baritone',
    level: 'intermediate',
    goals: 'Retomar después de pausa por viaje. Mantener nivel alcanzado.',
    generalObservations: 'En pausa temporal por trabajo en el exterior. Volverá en junio.',
    importantAlerts: ['Pausado hasta junio 2026 - viaje laboral'],
    technicalAssessment: {
      pitch: 3,
      breathing: 4,
      projection: 4,
      diction: 3,
      rhythm: 4,
      interpretation: 3,
      stagePresence: 3,
      commitment: 3
    },
    tags: ['pausado-temporal']
  },
  {
    firstName: 'Laura',
    lastName: 'Sánchez',
    email: 'laura.sanchez@example.com',
    phone: '+54 9 387 345-6789',
    type: 'private',
    status: 'active',
    joinDate: '2024-02-01',
    vocalRange: 'mezzo',
    level: 'intermediate',
    goals: 'Preparar repertorio de tango y folklore argentino. Trabajar expresividad.',
    generalObservations: 'Cantante de folklore con mucha personalidad. Necesita técnica formal.',
    technicalAssessment: {
      pitch: 3,
      breathing: 3,
      projection: 4,
      diction: 4,
      rhythm: 4,
      interpretation: 4,
      stagePresence: 5,
      commitment: 4
    },
    tags: ['folklore', 'tango', 'repertorio-argentino']
  },
  {
    firstName: 'Pedro',
    lastName: 'López',
    type: 'choir',
    status: 'active',
    joinDate: '2023-11-05',
    vocalRange: 'bass',
    level: 'intermediate',
    goals: 'Fortalecer registro grave y mejorar lectura de partituras.',
    generalObservations: 'Voz grave potente. Buena base musical, toca guitarra.',
    technicalAssessment: {
      pitch: 4,
      breathing: 3,
      projection: 4,
      diction: 3,
      rhythm: 4,
      interpretation: 3,
      stagePresence: 3,
      commitment: 4
    },
    tags: ['coro-principal', 'bajo', 'musico']
  },
  {
    firstName: 'Sofía',
    lastName: 'Ramírez',
    email: 'sofia.ramirez@example.com',
    type: 'private',
    status: 'active',
    joinDate: '2024-01-08',
    vocalRange: 'soprano',
    level: 'beginner',
    birthDate: '2008-05-15',
    goals: 'Desarrollar técnica vocal básica. Prepararse para el coro de la escuela.',
    generalObservations: 'Adolescente con voz clara. Trabajar especialmente cuidado vocal.',
    importantAlerts: ['Menor de edad - clases con autorización parental'],
    technicalAssessment: {
      pitch: 3,
      breathing: 2,
      projection: 2,
      diction: 3,
      rhythm: 3,
      interpretation: 2,
      stagePresence: 2,
      commitment: 4
    },
    tags: ['adolescente', 'principiante']
  },
  {
    firstName: 'Roberto',
    lastName: 'Torres',
    email: 'roberto.torres@example.com',
    type: 'both',
    status: 'graduated',
    joinDate: '2022-03-20',
    vocalRange: 'tenor',
    level: 'advanced',
    goals: 'Completado - ahora cantante profesional.',
    generalObservations: 'Egresado exitoso. Ahora trabaja como cantante lírico profesional.',
    technicalAssessment: {
      pitch: 5,
      breathing: 5,
      projection: 5,
      diction: 5,
      rhythm: 5,
      interpretation: 5,
      stagePresence: 5,
      commitment: 5
    },
    tags: ['egresado', 'exitoso', 'profesional']
  },
  {
    firstName: 'Valentina',
    lastName: 'Morales',
    email: 'valentina.morales@example.com',
    phone: '+54 9 387 456-7890',
    type: 'private',
    status: 'active',
    joinDate: '2024-04-01',
    vocalRange: 'soprano',
    level: 'beginner',
    goals: 'Superar miedo escénico y disfrutar del canto. No busca profesionalización.',
    generalObservations: 'Vino por recomendación. Muy nerviosa pero con potencial.',
    technicalAssessment: {
      pitch: 2,
      breathing: 2,
      projection: 1,
      diction: 3,
      rhythm: 2,
      interpretation: 2,
      stagePresence: 1,
      commitment: 3
    },
    tags: ['principiante', 'miedo-escenico', 'hobby']
  },
  {
    firstName: 'Diego',
    lastName: 'Vargas',
    type: 'choir',
    status: 'active',
    joinDate: '2023-09-15',
    vocalRange: 'baritone',
    level: 'intermediate',
    goals: 'Integración coral y trabajo en equipo. Mejorar blend con el grupo.',
    generalObservations: 'Excelente para trabajo en equipo. Líder natural en el coro.',
    technicalAssessment: {
      pitch: 4,
      breathing: 4,
      projection: 3,
      diction: 4,
      rhythm: 4,
      interpretation: 3,
      stagePresence: 4,
      commitment: 5
    },
    tags: ['coro-principal', 'lider', 'trabajo-equipo']
  }
];

/**
 * Tipos de clases predefinidas
 */
export const SEED_CLASS_TYPES: Omit<ClassType, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Técnica Vocal',
    description: 'Clase enfocada en fundamentos técnicos de canto: respiración, apoyo, colocación y resonancia.',
    suggestedDuration: 60,
    objectives: [
      'Mejorar respiración diafragmática',
      'Trabajar colocación vocal',
      'Desarrollar resonancia',
      'Fortalecer apoyo'
    ],
    structure: '1. Calentamiento corporal y respiratorio (10min)\n2. Ejercicios técnicos (30min)\n3. Aplicación en repertorio (15min)\n4. Cierre y tarea (5min)',
    resources: ['Espejo', 'Piano', 'Grabadora para feedback']
  },
  {
    name: 'Repertorio',
    description: 'Trabajo específico en piezas del repertorio del alumno.',
    suggestedDuration: 60,
    objectives: [
      'Interpretar obra musical',
      'Aplicar técnica vocal',
      'Desarrollar musicalidad',
      'Trabajar expresividad'
    ],
    structure: '1. Calentamiento breve (10min)\n2. Trabajo de la pieza (40min)\n3. Pulir detalles (10min)'
  },
  {
    name: 'Preparación Coral',
    description: 'Clase grupal para trabajo coral: blend, afinación grupal, lectura de partituras.',
    suggestedDuration: 90,
    objectives: [
      'Desarrollar blend coral',
      'Mejorar afinación en grupo',
      'Practicar lectura a primera vista',
      'Trabajar balance de voces'
    ],
    structure: '1. Calentamiento grupal (15min)\n2. Ejercicios de blend (20min)\n3. Repertorio coral (45min)\n4. Cierre (10min)'
  },
  {
    name: 'Respiración y Apoyo',
    description: 'Clase especializada en control respiratorio y apoyo diafragmático.',
    suggestedDuration: 45,
    objectives: [
      'Fortalecer músculo diafragmático',
      'Mejorar capacidad pulmonar',
      'Desarrollar control del aire',
      'Aplicar apoyo en canto'
    ]
  },
  {
    name: 'Interpretación',
    description: 'Clase enfocada en expresividad, comunicación y presencia escénica.',
    suggestedDuration: 60,
    objectives: [
      'Desarrollar expresividad',
      'Trabajar comunicación con público',
      'Mejorar presencia escénica',
      'Conectar con la emoción de la obra'
    ]
  },
  {
    name: 'Coaching Individual',
    description: 'Sesión personalizada según necesidades específicas del alumno.',
    suggestedDuration: 60,
    objectives: ['Según necesidades del alumno']
  }
];

/**
 * Notas de ejemplo
 */
export const SEED_NOTES: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    type: 'quick',
    category: 'observacion',
    title: 'María - Mejora notable en proyección',
    content: 'En la última clase noté un cambio significativo en la proyección de María. Los ejercicios de resonancia están dando resultado.',
    tags: ['maria', 'progreso', 'proyeccion'],
    isPinned: false
  },
  {
    type: 'private',
    category: 'recordatorio',
    title: 'Recordatorio: Comprar partituras nuevas',
    content: 'Necesito adquirir las partituras de repertorio coral para el segundo semestre. Revisar catálogo de editorial Ricordi.',
    tags: ['compras', 'partituras'],
    isPinned: true
  }
];

/**
 * Melodías/escalas de ejemplo
 */
export const SEED_MELODIES: Omit<Melody, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Escala Mayor Ascendente/Descendente',
    category: 'scale',
    key: 'Do Mayor',
    range: 'Do3-Do4',
    tempo: 'Moderato',
    difficulty: 'easy',
    technicalObjective: 'Trabajar afinación, colocación y transiciones de registro',
    description: 'Escala básica para calentamiento. Atención a cada nota, mantener posición.',
    teacherNotes: 'Comenzar siempre aquí. Observar tensiones en la mandíbula.',
    isFavorite: true,
    tags: ['calentamiento', 'basico', 'afinacion']
  },
  {
    name: 'Arpegios Mayores',
    category: 'exercise',
    difficulty: 'medium',
    technicalObjective: 'Desarrollar agilidad y saltos interválicos',
    description: 'Serie de arpegios en diferentes tonalidades. Trabajar legato.',
    tags: ['agilidad', 'intervalos']
  },
  {
    name: 'Sirena Vocal',
    category: 'warmup',
    difficulty: 'easy',
    technicalObjective: 'Calentar cuerdas vocales suavemente, conectar registros',
    description: 'Glissando ascendente y descendente sin texto. Muy suave.',
    teacherNotes: 'Excelente para iniciar clase. No forzar.',
    isFavorite: true,
    tags: ['calentamiento', 'cuerdas-vocales']
  }
];

/**
 * Planes de clase de ejemplo
 */
export const SEED_CLASS_PLANS: Omit<ClassPlan, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    title: 'Técnica Vocal - María González',
    status: 'ready',
    date: new Date(Date.now() + 86400000 * 2).toISOString(), // En 2 días
    duration: 60,
    objective: 'Trabajar registro de cabeza y proyección en el agudo',
    warmUp: 'Sirena vocal, escala mayor, arpegios',
    technicalExercises: ['Escala mayor con vocal "U"', 'Arpegios en staccato', 'Octavas con crescendo'],
    scales: ['Do Mayor', 'Re Mayor', 'Mi Mayor'],
    anticipatedDifficulties: 'Puede haber tensión en el pasaje. Recordar relajar cuello.',
    observations: 'Si el tiempo lo permite, trabajar una frase del aria que está estudiando.',
    homework: 'Practicar escalas diarias 10 minutos. Grabarse y enviar audio.',
    materials: ['Partituras de arias', 'Grabadora']
  }
];

/**
 * Función para inicializar datos semilla en localStorage
 */
export function seedDatabase() {
  // Solo inicializar si no hay datos previos
  if (localStorage.getItem('students')) {
    console.log('Database already seeded, skipping...');
    return;
  }

  console.log('Seeding database...');

  // Generar IDs y timestamps
  const students = SEED_STUDENTS.map(student => ({
    ...student,
    id: nanoid(),
    createdAt: now,
    updatedAt: now
  }));

  const classTypes = SEED_CLASS_TYPES.map(ct => ({
    ...ct,
    id: nanoid(),
    createdAt: now,
    updatedAt: now
  }));

  const notes = SEED_NOTES.map(note => ({
    ...note,
    id: nanoid(),
    createdAt: now,
    updatedAt: now,
    studentId: Math.random() > 0.5 ? students[0]?.id : undefined
  }));

  const melodies = SEED_MELODIES.map(melody => ({
    ...melody,
    id: nanoid(),
    createdAt: now,
    updatedAt: now
  }));

  const classPlans = SEED_CLASS_PLANS.map(plan => ({
    ...plan,
    id: nanoid(),
    studentId: students[0]?.id,
    classTypeId: classTypes[0]?.id,
    createdAt: now,
    updatedAt: now
  }));

  // Guardar en localStorage
  localStorage.setItem('students', JSON.stringify(students));
  localStorage.setItem('classTypes', JSON.stringify(classTypes));
  localStorage.setItem('notes', JSON.stringify(notes));
  localStorage.setItem('melodies', JSON.stringify(melodies));
  localStorage.setItem('classPlans', JSON.stringify(classPlans));
  localStorage.setItem('classRecords', JSON.stringify([]));
  localStorage.setItem('progressEntries', JSON.stringify([]));
  localStorage.setItem('attendanceRecords', JSON.stringify([]));

  console.log('Database seeded successfully!');
  console.log('- Students:', students.length);
  console.log('- Class Types:', classTypes.length);
  console.log('- Notes:', notes.length);
  console.log('- Melodies:', melodies.length);
  console.log('- Class Plans:', classPlans.length);
}
