// features/dashboard/components/SuggestionsSection.tsx

import { Lightbulb, Info, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { getTechnicalRecommendation, TechnicalInsight } from '@/shared/lib/technical-mindset';
import type { Student } from '@/shared/types/domain';
import { getStudentFullName } from '@/entities/student/utils';

interface SuggestionsSectionProps {
  students: Student[];
}

export function SuggestionsSection({ students }: SuggestionsSectionProps) {
  // Obtenemos un alumno que necesite atención (con scores bajos)
  const studentWithChallenges = students.find(s => 
    s.technicalAssessment && 
    Object.values(s.technicalAssessment).some(v => v <= 2)
  );

  const insight: TechnicalInsight | null = studentWithChallenges 
    ? getTechnicalRecommendation(studentWithChallenges.technicalAssessment as any)
    : null;

  if (!insight) return null;

  return (
    <Card className="border-soul-magenta/20 bg-soul-magenta/5 overflow-hidden group">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row items-stretch">
          <div className="bg-soul-magenta/10 p-6 flex flex-col justify-center items-center gap-2 border-r border-soul-magenta/10 md:w-48">
            <div className="h-12 w-12 rounded-full bg-soul-magenta/20 flex items-center justify-center text-soul-magenta animate-pulse">
              <Lightbulb className="h-6 w-6" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-soul-magenta/80">Coach Mindset</span>
          </div>
          
          <div className="p-6 flex-1 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-soul-magenta uppercase tracking-tighter bg-soul-magenta/10 px-2 py-0.5 rounded">
                  {insight.school}
                </span>
                <h3 className="text-lg font-bold text-foreground">{insight.title}</h3>
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed">
                <span className="font-semibold text-soul-magenta">Para {getStudentFullName(studentWithChallenges!)}:</span> {insight.description}
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-lg bg-surface-dark/50 p-3 border border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <Info className="h-3 w-3 text-muted-foreground" />
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Base Científica</span>
                </div>
                <p className="text-xs text-muted-foreground italic leading-tight">
                  "{insight.scientificBasis}"
                </p>
              </div>
              
              <div className="rounded-lg bg-primary/10 p-3 border border-primary/10 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-primary">Acción Recomendada</span>
                  <p className="text-xs font-medium text-foreground mt-1">
                    {insight.suggestedAction}
                  </p>
                </div>
                <Button variant="link" size="sm" className="h-auto p-0 justify-start text-[10px] font-bold uppercase text-primary hover:text-primary/80 mt-2">
                  Ver ejercicios en biblioteca <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
