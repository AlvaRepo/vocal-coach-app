// shared/lib/pedagogy-presets.ts

import { ModularClassBlock } from '../types/domain';

export const SCHOOL_PRESETS: Record<string, Partial<ModularClassBlock>[]> = {
  SOVT: [
    {
      type: 'sovt',
      title: 'Straw Phonation (Reset)',
      objective: 'Equilibrar presión sub/supraglótica y reducir esfuerzo.',
      duration: 5,
      exercises: ['Siren with straw', 'Melody with straw in water'],
    },
    {
      type: 'sovt',
      title: 'Lip Trills (Flow focus)',
      objective: 'Mejorar la gestión del aire y la aducción suave.',
      duration: 3,
      exercises: ['Lip trill sirens', 'Arpeggio with lip trill'],
    }
  ],
  Estill: [
    {
      type: 'estill',
      title: 'Thyroid Tilt (Sweet/Sob)',
      objective: 'Elongación de pliegues (CT) para notas agudas dulces.',
      duration: 7,
      exercises: ['Miren (Thin folds)', 'Cry-Siren'],
      meta: { figure: 'Thyroid Tilt' }
    },
    {
      type: 'estill',
      title: 'False Fold Retraction',
      objective: 'Eliminar el esfuerzo y el sonido apretado.',
      duration: 3,
      exercises: ['Silent Laugh', 'Silent breath'],
      meta: { figure: 'FVF Retraction' }
    },
    {
      type: 'estill',
      title: 'Cricoid Tilt (Power/Belt)',
      objective: 'Aumentar la masa vibratoria para sonidos potentes.',
      duration: 5,
      exercises: ['Strong call (Hey!)', 'Belting sirens'],
      meta: { figure: 'Cricoid Tilt' }
    }
  ],
  SLS: [
    {
      type: 'sls',
      title: 'Bridge Builder (Passaggio)',
      objective: 'Suavizar los quiebres entre registros.',
      duration: 8,
      exercises: ['Nay-Nay scales', 'Mum-Mum arpeggios'],
    },
    {
      type: 'sls',
      title: 'Neutral Larynx',
      objective: 'Mantener la laringe estable en todo el rango.',
      duration: 5,
      exercises: ['Gug-Gug descending', 'Deep larynx vowels'],
    }
  ],
  'Bel Canto': [
    {
      type: 'bel-canto',
      title: 'Appoggio Drill',
      objective: 'Control del aire mediante expansión intercostal.',
      duration: 10,
      exercises: ['Fricative sustain', 'Long phrases on A-E-I'],
    },
    {
      type: 'bel-canto',
      title: 'Chiaroscuro Balance',
      objective: 'Equilibrio entre brillo y profundidad tonal.',
      duration: 7,
      exercises: ['Messa di voce', 'Cuperlo exercises'],
    }
  ]
};

export const DEFAULT_HYBRID_PLAN = [
  ...(SCHOOL_PRESETS['SOVT'] || []).slice(0, 1),
  ...(SCHOOL_PRESETS['Estill'] || []).slice(1, 2),
  ...(SCHOOL_PRESETS['SLS'] || []).slice(0, 1),
];
