// shared/components/ui/VocalMap.tsx

import { TechnicalAssessment } from '@/shared/types/domain';

interface VocalMapProps {
  assessment: TechnicalAssessment;
  size?: number;
}

export function VocalMap({ assessment, size = 300 }: VocalMapProps) {
  const categories = [
    { key: 'pitch', label: 'Afinación' },
    { key: 'breathing', label: 'Respiración' },
    { key: 'projection', label: 'Proyección' },
    { key: 'diction', label: 'Dicción' },
    { key: 'rhythm', label: 'Ritmo' },
    { key: 'interpretation', label: 'Interpretación' },
  ];

  const center = size / 2;
  const radius = (size / 2) * 0.8;
  const angleStep = (Math.PI * 2) / categories.length;

  // Generar puntos para el polígono de datos
  const points = categories.map((cat, i) => {
    const value = (assessment[cat.key as keyof TechnicalAssessment] as number) || 1;
    const factor = value / 5;
    const x = center + radius * factor * Math.cos(angleStep * i - Math.PI / 2);
    const y = center + radius * factor * Math.sin(angleStep * i - Math.PI / 2);
    return `${x},${y}`;
  }).join(' ');

  // Generar líneas de la red (grid)
  const gridLevels = [1, 2, 3, 4, 5];
  
  return (
    <div className="flex flex-col items-center justify-center">
      <svg width={size} height={size} className="overflow-visible">
        {/* Grilla concéntrica */}
        {gridLevels.map((level) => {
          const r = radius * (level / 5);
          const gridPoints = categories.map((_, i) => {
            const x = center + r * Math.cos(angleStep * i - Math.PI / 2);
            const y = center + r * Math.sin(angleStep * i - Math.PI / 2);
            return `${x},${y}`;
          }).join(' ');
          
          return (
            <polygon
              key={level}
              points={gridPoints}
              className="fill-none stroke-white/5 stroke-1"
            />
          );
        })}

        {/* Ejes radiales */}
        {categories.map((_, i) => {
          const x = center + radius * Math.cos(angleStep * i - Math.PI / 2);
          const y = center + radius * Math.sin(angleStep * i - Math.PI / 2);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              className="stroke-white/5 stroke-1"
            />
          );
        })}

        {/* Polígono de Datos (The "Soul" of the voice) */}
        <polygon
          points={points}
          className="fill-soul-magenta/30 stroke-soul-magenta stroke-2 transition-all duration-700 ease-out"
        />

        {/* Puntos de datos */}
        {categories.map((cat, i) => {
          const value = (assessment[cat.key as keyof TechnicalAssessment] as number) || 1;
          const factor = value / 5;
          const x = center + radius * factor * Math.cos(angleStep * i - Math.PI / 2);
          const y = center + radius * factor * Math.sin(angleStep * i - Math.PI / 2);
          
          return (
            <g key={i}>
              <circle
                cx={x}
                cy={y}
                r="3"
                className="fill-soul-magenta"
              />
              {/* Etiquetas */}
              <text
                x={center + (radius + 20) * Math.cos(angleStep * i - Math.PI / 2)}
                y={center + (radius + 20) * Math.sin(angleStep * i - Math.PI / 2)}
                textAnchor="middle"
                className="fill-muted-foreground text-[9px] font-bold uppercase tracking-tighter"
              >
                {cat.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
