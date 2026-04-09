// features/dashboard/pages/DashboardPage.tsx

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Calendar, Music, TrendingUp, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { studentRepository } from '@/entities/student/repository';
import { classPlanRepository } from '@/entities/repositories';
import { getActiveStudents, getStudentFullName } from '@/entities/student/utils';
import { formatDate } from '@/shared/lib/date-utils';
import type { Student, ClassPlan } from '@/shared/types/domain';

export function DashboardPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [upcomingClasses, setUpcomingClasses] = useState<ClassPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      const [allStudents, allPlans] = await Promise.all([
        studentRepository.getAll(),
        classPlanRepository.getAll(),
      ]);

      setStudents(allStudents);
      
      // Filtrar próximas clases (que tengan fecha futura y estado ready)
      const upcoming = allPlans
        .filter(p => p.date && p.status === 'ready')
        .filter(p => new Date(p.date!) >= new Date())
        .sort((a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime())
        .slice(0, 5);
      
      setUpcomingClasses(upcoming);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }

  const activeStudents = getActiveStudents(students);
  const totalStudents = students.length;

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-sm text-muted-foreground">
            Resumen de tu actividad
          </p>
        </div>
      </div>

      {/* Quick Actions - diseño limpio sin + */}
      <div className="flex flex-wrap items-center gap-2">
        <Button asChild size="sm" className="bg-soul-magenta/80 hover:bg-soul-magenta">
          <Link to="/students/new">
            <Users className="mr-2 h-4 w-4" data-icon="inline-start" />
            Nuevo Alumno
          </Link>
        </Button>
        <Button asChild size="sm" variant="outline" className="border-white/10 hover:bg-white/5">
          <Link to="/classes/plans">
            <Calendar className="mr-2 h-4 w-4" data-icon="inline-start" />
            Planificar Clase
          </Link>
        </Button>
        <Button asChild size="sm" variant="outline" className="border-white/10 hover:bg-white/5">
          <Link to="/notes">
            <Plus className="mr-2 h-4 w-4" data-icon="inline-start" />
            Nueva Nota
          </Link>
        </Button>
        <Button asChild size="sm" variant="outline" className="border-white/10 hover:bg-white/5">
          <Link to="/library">
            <Music className="mr-2 h-4 w-4" data-icon="inline-start" />
            Agregar Melodía
          </Link>
        </Button>
        <Button asChild size="sm" variant="outline" className="border-white/10 hover:bg-white/5">
          <Link to="/calendar">
            <Calendar className="mr-1 h-3 w-3" />
            + Evento
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alumnos Activos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeStudents.length}</div>
            <p className="text-xs text-muted-foreground">
              de {totalStudents} totales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximas Clases</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingClasses.length}</div>
            <p className="text-xs text-muted-foreground">
              planificadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Coro</CardTitle>
            <Music className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {students.filter(s => s.type === 'choir' || s.type === 'both').length}
            </div>
            <p className="text-xs text-muted-foreground">
              alumnos en coro
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clases Particulares</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {students.filter(s => s.type === 'private' || s.type === 'both').length}
            </div>
            <p className="text-xs text-muted-foreground">
              alumnos particulares
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Próximas Clases */}
        <Card>
          <CardHeader>
            <CardTitle>Próximas Clases</CardTitle>
            <CardDescription>
              Clases planificadas para los próximos días
            </CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingClasses.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-sm text-muted-foreground">
                  No hay clases planificadas
                </p>
                <Button asChild className="mt-4" size="sm">
                  <Link to="/classes/plans">
                    <Plus className="mr-2 h-4 w-4" />
                    Planificar Clase
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingClasses.map((plan) => {
                  const student = students.find(s => s.id === plan.studentId);
                  
                  return (
                    <div
                      key={plan.id}
                      className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{plan.title}</p>
                        {student && (
                          <p className="text-sm text-muted-foreground">
                            {getStudentFullName(student)}
                          </p>
                        )}
                        {plan.date && (
                          <p className="text-xs text-muted-foreground">
                            {formatDate(plan.date, 'EEEE, dd/MM/yyyy')}
                          </p>
                        )}
                      </div>
                      <Badge>{plan.duration} min</Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Alumnos Recientes */}
        <Card>
          <CardHeader>
            <CardTitle>Alumnos Activos Recientes</CardTitle>
            <CardDescription>
              Últimos alumnos agregados
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activeStudents.length === 0 ? (
              <div className="text-center py-8">
                <Users className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-sm text-muted-foreground">
                  No hay alumnos activos
                </p>
                <Button asChild className="mt-4" size="sm">
                  <Link to="/students/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar Alumno
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {activeStudents
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .slice(0, 5)
                  .map((student) => (
                    <Link
                      key={student.id}
                      to={`/students/${student.id}`}
                      className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0 hover:bg-accent/50 rounded-lg p-2 -m-2 transition-colors"
                    >
                      <div>
                        <p className="text-sm font-medium">{getStudentFullName(student)}</p>
                        <p className="text-xs text-muted-foreground">
                          {student.level === 'beginner' && 'Principiante'}
                          {student.level === 'intermediate' && 'Intermedio'}
                          {student.level === 'advanced' && 'Avanzado'}
                          {!student.level && 'Nivel no definido'}
                        </p>
                      </div>
                      {student.vocalRange && student.vocalRange !== 'undefined' && (
                        <Badge variant="outline">{student.vocalRange}</Badge>
                      )}
                    </Link>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
