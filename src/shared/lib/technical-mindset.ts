// shared/lib/technical-mindset.ts

export interface TechnicalInsight {
  title: string;
  description: string;
  scientificBasis: string;
  suggestedAction: string;
  school: 'SOVT' | 'Estill' | 'SLS' | 'Bel Canto' | 'Acoustics';
}

export const TECHNICAL_INSIGHTS: Record<string, TechnicalInsight[]> = {
  breathing: [
    {
      title: 'Equilibrio de Presiones (SOVT)',
      description: 'El alumno presenta una gestión de aire ineficiente. El uso de ejercicios semi-ocluidos ayuda a equilibrar la presión subglótica con la supraglótica.',
      scientificBasis: 'La semi-oclusión del tracto aumenta la impedancia de entrada, facilitando la vibración de los pliegues vocales con menor esfuerzo muscular.',
      suggestedAction: 'Incorporar 5 min de fonación con bombilla (straw phonation) en agua.',
      school: 'SOVT'
    },
    {
      title: 'Apoyo y Gestión del Caudal',
      description: 'Dificultad para mantener el flujo constante en frases largas.',
      scientificBasis: 'La técnica de Appoggio permite una exhalación controlada inhibiendo el colapso torácico prematuro.',
      suggestedAction: 'Ejercicios de "fricativas sostenidas" (S... Z...) monitoreando la expansión intercostal.',
      school: 'Bel Canto'
    }
  ],
  pitch: [
    {
      title: 'Inclinación Tiroidea (Salud del Registro)',
      description: 'Dificultad para alcanzar notas agudas sin tensión.',
      scientificBasis: 'La inclinación del cartílago tiroides elonga los pliegues vocales (CT dominant), facilitando el paso al registro de cabeza.',
      suggestedAction: 'Ejercicios de "Cry/Sob" para inducir la inclinación del tiroides sin elevar la laringe.',
      school: 'Estill'
    },
    {
      title: 'Nivelación de Laringe',
      description: 'La laringe tiende a subir en el passaggio, provocando un sonido apretado.',
      scientificBasis: 'Una laringe elevada reduce el espacio faríngeo y aumenta la resistencia glótica de forma ineficiente.',
      suggestedAction: 'Uso de sonidos "Mum" o "Go" con énfasis en la sensación de bostezo incipiente.',
      school: 'SLS'
    }
  ],
  dictions: [
    {
      title: 'Espacio Inter-dentario y Mandíbula',
      description: 'La falta de claridad viene de una mandíbula excesivamente cerrada o tensa.',
      scientificBasis: 'La apertura mandibular afecta directamente el primer formante (F1), crucial para la inteligibilidad de las vocales.',
      suggestedAction: 'Ejercicios de lectura con corcho o "masticación" exagerada durante la vocalización.',
      school: 'Acoustics'
    }
  ],
  projection: [
    {
      title: 'Twang y Resonancia Epiglótica',
      description: 'La voz suena "lejos" o falta de brillo.',
      scientificBasis: 'El estrechamiento del esfínter ariepiglótico (AES) crea un refuerzo en el espectro entre 2 y 4 kHz (Ring del cantante).',
      suggestedAction: 'Ejercicios de "Duck" o "Bratty sounds" para activar el twang de forma aislada.',
      school: 'Estill'
    }
  ]
};

/**
 * Obtiene una recomendación técnica basada en el perfil del alumno
 */
export function getTechnicalRecommendation(scores: Record<string, number>): TechnicalInsight | null {
  // Buscamos el área con menor puntaje
  const sortedAreas = Object.entries(scores)
    .sort(([, a], [, b]) => a - b);
  
  const weakestEntry = sortedAreas[0];
  
  if (!weakestEntry) return null;

  const [weakestArea, score] = weakestEntry;
  
  if (score >= 4) return null; // Si está todo bien, no hay recomendación de emergencia

  const areaInsights = TECHNICAL_INSIGHTS[weakestArea];
  if (!areaInsights || areaInsights.length === 0) return null;

  // Retornamos una aleatoria de esa área para rotar el conocimiento
  const recommendation = areaInsights[Math.floor(Math.random() * areaInsights.length)];
  return recommendation || null;
}
