// features/students/pages/StudentDetailPage.tsx

import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Mail, Phone, Calendar, Target, AlertCircle } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { studentRepository } from '@/entities/student/repository';
import {
  getStudentFullName,
  getStudentInitials,
  getStatusColor,
  getStatusLabel,
  getLevelLabel,
  getVocalRangeLabel,
  getTypeLabel,
  calculateTechnicalAverage,
} from '@/entities/student/utils';
import { formatDate } from '@/shared/lib/date-utils';
import { VocalMap } from '@/shared/components/ui/VocalMap';
import { getTechnicalRecommendation } from '@/shared/lib/technical-mindset';
import type { Student } from '@/shared/types/domain';

export function StudentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudent();
  }, [id]);

  async function loadStudent() {
    if (!id) return;
    
    try {
      const data = await studentRepository.getById(id);
      if (!data) {
        navigate('/students');
        return;
      }
      setStudent(data);
    } catch (error) {
      console.error('Error loading student:', error);
      navigate('/students');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  if (!student) {
    return null;
  }

  const technicalAverage = calculateTechnicalAverage(student);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/students">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">
            {getStudentFullName(student)}
          </h1>
          <p className="text-muted-foreground">Ficha del alumno</p>
        </div>
        <Button asChild>
          <Link to={`/students/${student.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Link>
        </Button>
      </div>

      {/* Overview Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-6">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                {getStudentInitials(student)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant={getStatusColor(student.status)}>
                  {getStatusLabel(student.status)}
                </Badge>
                <Badge variant="outline">{getTypeLabel(student.type)}</Badge>
                <Badge variant="outline">{getLevelLabel(student.level)}</Badge>
                {student.vocalRange && student.vocalRange !== 'undefined' && (
                  <Badge variant="outline">{getVocalRangeLabel(student.vocalRange)}</Badge>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {student.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a href={`mailto:${student.email}`} className="text-blue-600 hover:underline">
                      {student.email}
                    </a>
                  </div>
                )}
                {student.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{student.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Ingreso: {formatDate(student.joinDate)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Alerts */}
      {student.importantAlerts && student.importantAlerts.length > 0 && (
        <Alert variant="warning">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Alertas Importantes</AlertTitle>
          <AlertDescription>
            <ul className="list-disc list-inside space-y-1">
              {student.importantAlerts.map((alert, index) => (
                <li key={index}>{alert}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Tabs */}
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="technical">Evaluación Técnica</TabsTrigger>
          <TabsTrigger value="progress">Progreso</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Goals */}
            {student.goals && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Objetivos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-wrap">{student.goals}</p>
                </CardContent>
              </Card>
            )}

            {/* Observations */}
            {student.generalObservations && (
              <Card>
                <CardHeader>
                  <CardTitle>Observaciones Generales</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-wrap">{student.generalObservations}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Tags */}
          {student.tags && student.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Etiquetas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {student.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="technical" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Evaluación Técnica</CardTitle>
              <CardDescription>
                Evaluación de habilidades vocales (escala 1-5)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!student.technicalAssessment ? (
                <p className="text-sm text-muted-foreground">
                  No hay evaluación técnica registrada
                </p>
              ) : (
                <div className="space-y-4">
                  {technicalAverage !== null && (
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="rounded-xl bg-surface-dark border border-white/5 p-6 flex flex-col items-center justify-center">
                        <VocalMap assessment={student.technicalAssessment} />
                        <div className="mt-6 text-center">
                          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Promedio General</p>
                          <p className="text-4xl font-black text-soul-magenta">{technicalAverage}/5</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="rounded-xl border border-soul-magenta/20 bg-soul-magenta/5 p-6">
                          <div className="flex items-center gap-2 mb-3">
                            <Target className="h-4 w-4 text-soul-magenta" />
                            <h4 className="text-sm font-bold uppercase tracking-tight text-soul-magenta">Insight Pedagógico</h4>
                          </div>
                          {(() => {
                            const insight = getTechnicalRecommendation(student.technicalAssessment as any);
                            if (!insight) return <p className="text-sm text-muted-foreground italic">El alumno presenta un equilibrio técnico excelente.</p>;
                            
                            return (
                              <div className="space-y-4 text-sm">
                                <p className="font-medium text-foreground">
                                  Prioridad: <span className="text-soul-magenta">{insight.title}</span>
                                </p>
                                <p className="text-muted-foreground leading-relaxed">
                                  {insight.description}
                                </p>
                                <div className="rounded-lg bg-surface-dark/80 p-3 border border-white/5">
                                  <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Acción</p>
                                  <p className="text-xs">{insight.suggestedAction}</p>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                        
                        <div className="rounded-xl border border-white/5 bg-white/5 p-6">
                          <h4 className="text-sm font-bold uppercase tracking-tight mb-4">Métricas Detalladas</h4>
                          <div className="grid gap-3">
                            {Object.entries(student.technicalAssessment).map(([key, value]) => {
                              if (value === undefined) return null;
                              
                              const labels: Record<string, string> = {
                                pitch: 'Afinación',
                                breathing: 'Respiración',
                                projection: 'Proyección',
                                diction: 'Dicción',
                                rhythm: 'Ritmo',
                                interpretation: 'Interpretación',
                                stagePresence: 'Presencia Escénica',
                                commitment: 'Compromiso/Constancia',
                              };
                              
                              return (
                                <div key={key} className="flex items-center justify-between">
                                  <span className="text-sm font-medium">{labels[key] || key}</span>
                                  <div className="flex items-center gap-2">
                                    <div className="flex gap-1">
                                      {[1, 2, 3, 4, 5].map((level) => (
                                        <div
                                          key={level}
                                          className={`h-6 w-6 rounded-sm ${
                                            level <= value
                                              ? 'bg-soul-magenta'
                                              : 'bg-white/10'
                                          }`}
                                        />
                                      ))}
                                    </div>
                                    <span className="text-sm font-bold w-8 text-right">{value}/5</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Progreso</CardTitle>
              <CardDescription>
                Evolución del alumno a lo largo del tiempo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-sm text-muted-foreground">
                  🔴 PLACEHOLDER: Módulo de progreso histórico
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Aquí se mostrará el seguimiento de progreso del alumno
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
