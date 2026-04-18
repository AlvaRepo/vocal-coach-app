// features/classes/pages/ClassPlansPage.tsx

import { Plus, Calendar, CheckCircle2, Clock, Pencil, Trash2, XCircle, CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Badge } from '@/shared/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { classPlanRepository } from '@/entities/repositories';
import { cn } from '@/shared/lib/utils';
import { studentRepository } from '@/entities/student/repository';
import { classTypeRepository } from '@/entities/repositories';
import { formatDate } from '@/shared/lib/date-utils';
import { getStudentFullName } from '@/entities/student/utils';
import type { ClassPlan, Student, ClassType } from '@/shared/types/domain';
import { classPlanFormSchema, type ClassPlanFormData } from '../schemas/class-plan-form.schema';
import { ModularPlanner } from '../components/ModularPlanner';
import { DEFAULT_HYBRID_PLAN } from '@/shared/lib/pedagogy-presets';

export function ClassPlansPage() {
  const [plans, setPlans] = useState<ClassPlan[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [classTypes, setClassTypes] = useState<ClassType[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<ClassPlan | null>(null);
  const [filterStudent, setFilterStudent] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [modularBlocks, setModularBlocks] = useState<ClassPlan['modularBlocks']>([]);

  const form = useForm<ClassPlanFormData>({
    resolver: zodResolver(classPlanFormSchema),
    defaultValues: {
      title: '',
      studentId: '',
      classTypeId: '',
      date: '',
      time: '',
      duration: 60,
      objective: '',
      exercises: '',
      warmup: '',
      repertoire: '',
      difficultiesExpected: '',
      observations: '',
      status: 'draft',
    },
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (editingPlan) {
      const planDate = editingPlan.date ? editingPlan.date.split('T')[0] : '';
      const planTime = editingPlan.date ? editingPlan.date.split('T')[1]?.slice(0, 5) : '';
      form.reset({
        title: editingPlan.title,
        studentId: editingPlan.studentId || '',
        classTypeId: editingPlan.classTypeId || '',
        date: planDate,
        time: planTime,
        duration: editingPlan.duration,
        objective: editingPlan.objective || '',
        exercises: editingPlan.technicalExercises?.join('\n') || '',
        warmup: editingPlan.warmUp || '',
        repertoire: editingPlan.repertoire?.join('\n') || '',
        difficultiesExpected: editingPlan.anticipatedDifficulties || '',
        observations: editingPlan.observations || '',
        status: editingPlan.status,
      });
      setModularBlocks(editingPlan.modularBlocks || []);
      setIsAdvancedMode(!!editingPlan.modularBlocks?.length);
    } else {
      form.reset({
        title: '',
        studentId: '',
        classTypeId: '',
        date: '',
        time: '',
        duration: 60,
        objective: '',
        exercises: '',
        warmup: '',
        repertoire: '',
        difficultiesExpected: '',
        observations: '',
        status: 'draft',
      });
    }
  }, [editingPlan, form]);

  async function loadData() {
    try {
      const [plansData, studentsData, classTypesData] = await Promise.all([
        classPlanRepository.getAll(),
        studentRepository.getAll(),
        classTypeRepository.getAll(),
      ]);
      setPlans(plansData);
      setStudents(studentsData);
      setClassTypes(classTypesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(data: ClassPlanFormData) {
    const exercisesArray = data.exercises
      ? data.exercises.split('\n').map((e) => e.trim()).filter(Boolean)
      : [];
    const repertoireArray = data.repertoire
      ? data.repertoire.split('\n').map((r) => r.trim()).filter(Boolean)
      : [];

    let dateStr: string | undefined;
    if (data.date) {
      dateStr = data.time ? `${data.date}T${data.time}:00` : `${data.date}T00:00:00`;
    }

    const planData: Omit<ClassPlan, 'id' | 'createdAt' | 'updatedAt'> = {
      title: data.title,
      studentId: data.studentId || undefined,
      classTypeId: data.classTypeId || undefined,
      date: dateStr,
      duration: data.duration,
      status: data.status,
      objective: data.objective || undefined,
      warmUp: data.warmup || undefined,
      technicalExercises: exercisesArray,
      repertoire: repertoireArray,
      anticipatedDifficulties: data.difficultiesExpected || undefined,
      observations: data.observations || undefined,
      modularBlocks: isAdvancedMode ? modularBlocks : undefined,
    };

    try {
      if (editingPlan) {
        await classPlanRepository.update(editingPlan.id, planData);
      } else {
        await classPlanRepository.create(planData);
      }
      await loadData();
      setDialogOpen(false);
      setEditingPlan(null);
    } catch (error) {
      console.error('Error saving plan:', error);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Estás seguro de eliminar esta planificación?')) return;
    try {
      await classPlanRepository.delete(id);
      await loadData();
    } catch (error) {
      console.error('Error deleting plan:', error);
    }
  }

  async function handleUpdateStatus(id: string, status: ClassPlan['status']) {
    try {
      await classPlanRepository.update(id, { status });
      await loadData();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  }

  function handleEdit(plan: ClassPlan) {
    setEditingPlan(plan);
    setDialogOpen(true);
  }

  function handleDialogClose(open: boolean) {
    setDialogOpen(open);
    if (!open) {
      setEditingPlan(null);
      form.reset();
    }
  }

  const getStatusBadge = (status: ClassPlan['status']) => {
    const variants: Record<ClassPlan['status'], { variant: 'default' | 'secondary' | 'success' | 'warning' | 'destructive'; label: string }> = {
      draft: { variant: 'secondary', label: 'Borrador' },
      ready: { variant: 'success', label: 'Lista' },
      completed: { variant: 'default', label: 'Completada' },
      cancelled: { variant: 'destructive', label: 'Cancelada' },
    };
    const config = variants[status];
    return <Badge variant={config.variant as any}>{config.label}</Badge>;
  };

  const getClassTypeName = (classTypeId?: string) => {
    if (!classTypeId) return null;
    const ct = classTypes.find((c) => c.id === classTypeId);
    return ct ? ct.name : null;
  };

  const filteredPlans = plans.filter((plan) => {
    if (filterStudent === 'none') {
      if (plan.studentId) return false;
    } else if (filterStudent !== 'all' && plan.studentId !== filterStudent) {
      return false;
    }
    if (filterStatus !== 'all' && plan.status !== filterStatus) return false;
    return true;
  });

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
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Planificación de Clases</h1>
          <p className="text-muted-foreground">
            Organiza y prepara tus clases antes de dictarlas
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Planificación
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPlan ? 'Editar Planificación' : 'Nueva Planificación'}
              </DialogTitle>
              <DialogDescription>
                {editingPlan
                  ? 'Modifica los datos de la planificación'
                  : 'Crea una nueva planificación de clase'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Título *
                </label>
                <Input
                  id="title"
                  placeholder="Ej: Clase de técnica vocal"
                  {...form.register('title')}
                />
                {form.formState.errors.title && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.title.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="studentId" className="text-sm font-medium">
                  Estudiante *
                </label>
                <Select
                  value={form.watch('studentId') || 'none'}
                  onValueChange={(value) => form.setValue('studentId', value === 'none' ? '' : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estudiante..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Clase grupal (sin alumno específico)</SelectItem>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.firstName} {student.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.studentId && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.studentId.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="classTypeId" className="text-sm font-medium">
                  Tipo de Clase
                </label>
                <Select
                  value={form.watch('classTypeId') || 'none'}
                  onValueChange={(value) => form.setValue('classTypeId', value === 'none' ? '' : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Ninguno</SelectItem>
                    {classTypes.map((ct) => (
                      <SelectItem key={ct.id} value={ct.id}>
                        {ct.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="date" className="text-sm font-medium">
                    Fecha
                  </label>
                  <Input id="date" type="date" {...form.register('date')} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="time" className="text-sm font-medium">
                    Hora
                  </label>
                  <Input id="time" type="time" {...form.register('time')} />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="duration" className="text-sm font-medium">
                  Duración (minutos)
                </label>
                <Input
                  id="duration"
                  type="number"
                  min={15}
                  max={180}
                  {...form.register('duration')}
                />
              </div>

              <div className="flex items-center justify-between py-2 border-y border-white/5 my-4">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-bold uppercase tracking-tight text-soul-magenta">Modo Avanzado</h4>
                  <p className="text-[10px] text-muted-foreground italic">Usar bloques pedagógicos (Estill, SLS, SOVT)</p>
                </div>
                <Button 
                  type="button" 
                  variant={isAdvancedMode ? "default" : "outline"} 
                  size="sm" 
                  className={cn("h-7 px-3 text-[10px] font-bold", isAdvancedMode && "bg-soul-magenta hover:bg-soul-magenta/80")}
                  onClick={() => {
                    if (!isAdvancedMode && modularBlocks?.length === 0) setModularBlocks(DEFAULT_HYBRID_PLAN as any);
                    setIsAdvancedMode(!isAdvancedMode);
                  }}
                >
                  {isAdvancedMode ? "ACTIVADO" : "ACTIVAR"}
                </Button>
              </div>

              {isAdvancedMode ? (
                <ModularPlanner 
                  blocks={modularBlocks || []} 
                  onChange={setModularBlocks} 
                />
              ) : (
                <>
                  <div className="space-y-2">
                    <label htmlFor="objective" className="text-sm font-medium">
                      Objetivo de la Clase
                    </label>
                    <Textarea
                      id="objective"
                      placeholder="¿Qué quieres lograr en esta clase?"
                      {...form.register('objective')}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="warmup" className="text-sm font-medium">
                      Calentamiento
                    </label>
                    <Textarea
                      id="warmup"
                      placeholder="Ejercicios de calentamiento..."
                      {...form.register('warmup')}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="exercises" className="text-sm font-medium">
                      Ejercicios Técnicos (uno por línea)
                    </label>
                    <Textarea
                      id="exercises"
                      placeholder="Ejercicio 1&#10;Ejercicio 2"
                      rows={3}
                      {...form.register('exercises')}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="repertoire" className="text-sm font-medium">
                      Repertorio (uno por línea)
                    </label>
                    <Textarea
                      id="repertoire"
                      placeholder="Canción 1&#10;Canción 2"
                      rows={3}
                      {...form.register('repertoire')}
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <label htmlFor="difficultiesExpected" className="text-sm font-medium">
                  Dificultades Previstas
                </label>
                <Textarea
                  id="difficultiesExpected"
                  placeholder="¿Qué dificultades esperas?"
                  {...form.register('difficultiesExpected')}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="observations" className="text-sm font-medium">
                  Observaciones
                </label>
                <Textarea
                  id="observations"
                  placeholder="Notas adicionales..."
                  {...form.register('observations')}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium">
                  Estado
                </label>
                <Select
                  value={form.watch('status')}
                  onValueChange={(value) =>
                    form.setValue('status', value as ClassPlanFormData['status'])
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Borrador</SelectItem>
                    <SelectItem value="ready">Lista</SelectItem>
                    <SelectItem value="completed">Completada</SelectItem>
                    <SelectItem value="cancelled">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleDialogClose(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingPlan ? 'Guardar Cambios' : 'Crear Planificación'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Filtrar por estudiante</label>
          <Select value={filterStudent} onValueChange={setFilterStudent}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Todos los estudiantes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="none">Clases grupales</SelectItem>
              {students.map((student) => (
                <SelectItem key={student.id} value={student.id}>
                  {student.firstName} {student.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Filtrar por estado</label>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Todos los estados" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="draft">Borrador</SelectItem>
              <SelectItem value="ready">Lista</SelectItem>
              <SelectItem value="completed">Completada</SelectItem>
              <SelectItem value="cancelled">Cancelada</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Plans List */}
      {filteredPlans.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Planificaciones ({filteredPlans.length})</h2>
          <div className="grid gap-4">
            {filteredPlans.map((plan) => {
              const student = students.find((s) => s.id === plan.studentId);

              return (
                <Card key={plan.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {plan.title}
                          {getStatusBadge(plan.status)}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {student ? getStudentFullName(student) : 'Clase grupal'}
                          {plan.classTypeId && (
                            <span className="ml-2">
                              • {getClassTypeName(plan.classTypeId)}
                            </span>
                          )}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-1">
                        {plan.status === 'draft' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-success"
                            onClick={() => handleUpdateStatus(plan.id, 'ready')}
                            title="Marcar como lista"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        {plan.status === 'ready' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleUpdateStatus(plan.id, 'completed')}
                            title="Marcar como completada"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>
                        )}
                        {(plan.status === 'draft' || plan.status === 'ready') && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => handleUpdateStatus(plan.id, 'cancelled')}
                            title="Cancelar"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEdit(plan)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleDelete(plan.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-3 text-sm">
                      {plan.date && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{formatDate(plan.date)}</span>
                        </div>
                      )}
                      {plan.duration && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{plan.duration} minutos</span>
                        </div>
                      )}
                      {plan.objective && (
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                          <span className="truncate">{plan.objective}</span>
                        </div>
                      )}
                    </div>

                    {plan.observations && (
                      <p className="mt-4 text-sm text-muted-foreground line-clamp-2">
                        {plan.observations}
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Calendar className="h-16 w-16 text-muted-foreground/50" />
            <p className="mt-4 text-lg font-medium">No hay planificaciones</p>
            <p className="text-sm text-muted-foreground">
              Crea tu primera planificación de clase
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
