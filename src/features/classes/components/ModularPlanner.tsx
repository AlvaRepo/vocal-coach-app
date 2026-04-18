// features/classes/components/ModularPlanner.tsx

import { Trash2, GripVertical, Info, Zap } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { SCHOOL_PRESETS } from '@/shared/lib/pedagogy-presets';
import { ModularClassBlock, ClassroomModuleType } from '@/shared/types/domain';
import { cn } from '@/shared/lib/utils';

interface ModularPlannerProps {
  blocks: ModularClassBlock[];
  onChange: (blocks: ModularClassBlock[]) => void;
}

export function ModularPlanner({ blocks, onChange }: ModularPlannerProps) {
  const addBlock = (preset: Partial<ModularClassBlock>) => {
    const newBlock: ModularClassBlock = {
      id: crypto.randomUUID(),
      type: preset.type || 'custom',
      title: preset.title || 'Nuevo Bloque',
      duration: preset.duration || 5,
      objective: preset.objective || '',
      exercises: preset.exercises || [],
      meta: preset.meta,
    };
    onChange([...blocks, newBlock]);
  };

  const removeBlock = (id: string) => {
    onChange(blocks.filter(b => b.id !== id));
  };

  const updateBlock = (id: string, updates: Partial<ModularClassBlock>) => {
    onChange(blocks.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const getModuleColor = (type: ClassroomModuleType) => {
    switch (type) {
      case 'sovt': return 'border-blue-500/50 bg-blue-500/5 text-blue-500';
      case 'estill': return 'border-soul-magenta/50 bg-soul-magenta/5 text-soul-magenta';
      case 'sls': return 'border-orange-500/50 bg-orange-500/5 text-orange-500';
      case 'bel-canto': return 'border-emerald-500/50 bg-emerald-500/5 text-emerald-500';
      default: return 'border-white/10 bg-white/5 text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Selector de Módulos (Presets de Escuelas) */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-soul-magenta" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-soul-magenta">Biblioteca de Módulos</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(SCHOOL_PRESETS).map(([school, presets]) => (
            <div key={school} className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase px-1">{school}</span>
              <div className="flex flex-wrap gap-1">
                {presets.map((preset, idx) => (
                  <Button
                    key={idx}
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 text-[10px] border-white/5 bg-surface-dark hover:bg-white/5 transition-all"
                    onClick={() => addBlock(preset)}
                  >
                    + {preset.title}
                  </Button>
                ))}
              </div>
            </div>
          ))}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase px-1">Propios</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 text-[10px] border-dashed border-white/20 hover:border-soul-magenta/50"
              onClick={() => addBlock({ type: 'custom', title: 'Bloque Libre', duration: 10 })}
            >
              + Personalizado
            </Button>
          </div>
        </div>
      </div>

      {/* Lista de Bloques (Timeline) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Estructura de la Clase</h3>
          </div>
          <Badge variant="outline" className="text-[10px]">
            Total: {blocks.reduce((acc, b) => acc + b.duration, 0)} min
          </Badge>
        </div>

        {blocks.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/5 bg-white/5 p-8 text-center">
            <p className="text-sm text-muted-foreground italic">No hay bloques en este plan. Seleccioná uno arriba para empezar.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {blocks.map((block, index) => (
              <Card key={block.id} className={cn("relative overflow-hidden border-l-4", getModuleColor(block.type))}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center gap-1 text-muted-foreground/50">
                      <span className="text-[10px] font-bold">{index + 1}</span>
                      <GripVertical className="h-4 w-4 cursor-grab active:cursor-grabbing" />
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <input
                            className="bg-transparent border-none font-bold text-foreground focus:ring-0 p-0 text-sm"
                            value={block.title}
                            onChange={(e) => updateBlock(block.id, { title: e.target.value })}
                          />
                          <Badge variant="secondary" className="text-[9px] h-4 uppercase">
                            {block.type}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              className="w-8 bg-transparent border-none text-right text-xs font-bold focus:ring-0 p-0"
                              value={block.duration}
                              onChange={(e) => updateBlock(block.id, { duration: parseInt(e.target.value) || 0 })}
                            />
                            <span className="text-[10px] text-muted-foreground">min</span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 text-muted-foreground hover:text-destructive"
                            onClick={() => removeBlock(block.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid gap-3 md:grid-cols-2">
                        <div className="space-y-1">
                          <span className="text-[9px] font-bold uppercase text-muted-foreground flex items-center gap-1">
                            <Info className="h-2.5 w-2.5" /> Objetivo
                          </span>
                          <textarea
                            className="w-full bg-transparent border-none text-xs text-foreground/80 focus:ring-0 p-0 resize-none leading-tight"
                            rows={2}
                            value={block.objective}
                            placeholder="Escribí el objetivo..."
                            onChange={(e) => updateBlock(block.id, { objective: e.target.value })}
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] font-bold uppercase text-muted-foreground">Ejercicios</span>
                          <textarea
                            className="w-full bg-transparent border-none text-xs text-foreground/80 focus:ring-0 p-0 resize-none leading-tight italic"
                            rows={2}
                            value={block.exercises.join('\n')}
                            placeholder="Ejercicio 1&#10;Ejercicio 2"
                            onChange={(e) => updateBlock(block.id, { exercises: e.target.value.split('\n') })}
                          />
                        </div>
                      </div>

                      {block.meta?.figure && (
                        <div className="flex items-center gap-2 pt-1">
                          <Badge variant="outline" className="border-soul-magenta/30 text-soul-magenta text-[9px]">
                            {block.meta.figure}
                          </Badge>
                          <span className="text-[9px] text-muted-foreground italic">Figura Estill detectada</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
