// features/classes/pages/ClassRecordsPage.tsx

import { Plus, FileText, Pencil, Trash2, Calendar, Clock } from 'lucide-react';
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
import { classRecordRepository } from '@/entities/repositories';
import { studentRepository } from '@/entities/student/repository';
import { classTypeRepository } from '@/entities/repositories';
import { formatDate } from '@/shared/lib/date-utils';
import { getStudentFullName } from '@/entities/student/utils';
import type { ClassRecord, Student, ClassType } from '@/shared/types/domain';
import { classRecordFormSchema, type ClassRecordFormData } from '../schemas/class-record-form.schema';

export function ClassRecordsPage() {
  const [records, setRecords] = useState<ClassRecord[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [classTypes, setClassTypes] = useState<ClassType[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ClassRecord | null>(null);
  const [filterStudent, setFilterStudent] = useState<string>('all');
  const [filterAttendance, setFilterAttendance] = useState<string>('all');

  const form = useForm<ClassRecordFormData>({
    resolver: zodResolver(classRecordFormSchema),
    defaultValues: {
      studentId: '',
      classTypeId: '',
      date: new Date().toISOString().split('T')[0],
      duration: 60,
      attendance: 'attended',
      topicsWorkedOn: '',
      exercisesPerformed: '',
      results: '',
      whatWentWell: '',
      whatNeedsWork: '',
      nextSteps: '',
      homework: '',
      progressNotes: '',
      teacherNotes: '',
    },
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (editingRecord) {
      form.reset({
        studentId: editingRecord.studentId || '',
        classTypeId: editingRecord.classTypeId || '',
        date: editingRecord.date.split('T')[0],
        duration: editingRecord.duration,
        attendance: editingRecord.attendance,
        topicsWorkedOn: editingRecord.topicsWorkedOn?.join('\n') || '',
        exercisesPerformed: editingRecord.exercisesPerformed?.join('\n') || '',
        results: editingRecord.results || '',
        whatWentWell: editingRecord.whatWentWell || '',
        whatNeedsWork: editingRecord.whatNeedsWork || '',
        nextSteps: editingRecord.nextSteps || '',
        homework: editingRecord.homework || '',
        progressNotes: editingRecord.progressNotes || '',
        teacherNotes: editingRecord.teacherNotes || '',
      });
    } else {
      form.reset({
        studentId: '',
        classTypeId: '',
        date: new Date().toISOString().split('T')[0],
        duration: 60,
        attendance: 'attended',
        topicsWorkedOn: '',
        exercisesPerformed: '',
        results: '',
        whatWentWell: '',
        whatNeedsWork: '',
        nextSteps: '',
        homework: '',
        progressNotes: '',
        teacherNotes: '',
      });
    }
  }, [editingRecord, form]);

  async function loadData() {
    try {
      const [recordsData, studentsData, classTypesData] = await Promise.all([
        classRecordRepository.getAll(),
        studentRepository.getAll(),
        classTypeRepository.getAll(),
      ]);
      setRecords(recordsData);
      setStudents(studentsData);
      setClassTypes(classTypesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(data: ClassRecordFormData) {
    const topicsArray = data.topicsWorkedOn
      ? data.topicsWorkedOn.split('\n').map((t) => t.trim()).filter(Boolean)
      : [];
    const exercisesArray = data.exercisesPerformed
      ? data.exercisesPerformed.split('\n').map((e) => e.trim()).filter(Boolean)
      : [];

    const recordData: Omit<ClassRecord, 'id' | 'createdAt' | 'updatedAt'> = {
      studentId: data.studentId || undefined,
      classTypeId: data.classTypeId || undefined,
      date: data.date,
      duration: data.duration,
      attendance: data.attendance,
      topicsWorkedOn: topicsArray,
      exercisesPerformed: exercisesArray,
      results: data.results || undefined,
      whatWentWell: data.whatWentWell || undefined,
      whatNeedsWork: data.whatNeedsWork || undefined,
      nextSteps: data.nextSteps || undefined,
      homework: data.homework || undefined,
      progressNotes: data.progressNotes || undefined,
      teacherNotes: data.teacherNotes || undefined,
    };

    try {
      if (editingRecord) {
        await classRecordRepository.update(editingRecord.id, recordData);
      } else {
        await classRecordRepository.create(recordData);
      }
      await loadData();
      setDialogOpen(false);
      setEditingRecord(null);
    } catch (error) {
      console.error('Error saving record:', error);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Estás seguro de eliminar este registro?')) return;
    try {
      await classRecordRepository.delete(id);
      await loadData();
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  }

  function handleEdit(record: ClassRecord) {
    setEditingRecord(record);
    setDialogOpen(true);
  }

  function handleDialogClose(open: boolean) {
    setDialogOpen(open);
    if (!open) {
      setEditingRecord(null);
      form.reset();
    }
  }

  const getAttendanceBadge = (attendance?: ClassRecord['attendance']) => {
    if (!attendance) return <Badge variant="secondary">Sin registro</Badge>;
    
    const variants: Record<string, { variant: 'success' | 'destructive' | 'secondary' | 'warning'; label: string }> = {
      attended: { variant: 'success', label: 'Presente' },
      absent: { variant: 'destructive', label: 'Ausente' },
      cancelled: { variant: 'secondary', label: 'Cancelada' },
      rescheduled: { variant: 'warning', label: 'Reprogramada' },
    };
    const config = variants[attendance];
    if (!config) return <Badge variant="secondary">Desconocido</Badge>;
    return <Badge variant={config.variant as any}>{config.label}</Badge>;
  };

  const getClassTypeName = (classTypeId?: string) => {
    if (!classTypeId) return null;
    const ct = classTypes.find((c) => c.id === classTypeId);
    return ct ? ct.name : null;
  };

  const filteredRecords = records.filter((record) => {
    if (filterStudent === 'none') {
      if (record.studentId) return false;
    } else if (filterStudent !== 'all' && record.studentId !== filterStudent) {
      return false;
    }
    if (filterAttendance !== 'all' && record.attendance !== filterAttendance) return false;
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
          <h1 className="text-3xl font-bold tracking-tight">Registro de Clases</h1>
          <p className="text-muted-foreground">
            Documenta las clases realizadas y el progreso observado
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Registro
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingRecord ? 'Editar Registro' : 'Nuevo Registro de Clase'}
              </DialogTitle>
              <DialogDescription>
                {editingRecord
                  ? 'Modifica los datos del registro'
                  : 'Registra los detalles de la clase tomada'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label htmlFor="date" className="text-sm font-medium">
                    Fecha *
                  </label>
                  <Input id="date" type="date" {...form.register('date')} />
                  {form.formState.errors.date && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.date.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="duration" className="text-sm font-medium">
                    Duración (min) *
                  </label>
                  <Input
                    id="duration"
                    type="number"
                    min={15}
                    max={180}
                    {...form.register('duration')}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="attendance" className="text-sm font-medium">
                    Asistencia *
                  </label>
                  <Select
                    value={form.watch('attendance')}
                    onValueChange={(value) =>
                      form.setValue('attendance', value as ClassRecordFormData['attendance'])
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="attended">Presente</SelectItem>
                      <SelectItem value="absent">Ausente</SelectItem>
                      <SelectItem value="cancelled">Cancelada</SelectItem>
                      <SelectItem value="rescheduled">Reprogramada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="topicsWorkedOn" className="text-sm font-medium">
                  Temas Trabajados (uno por línea)
                </label>
                <Textarea
                  id="topicsWorkedOn"
                  placeholder="Tema 1&#10;Tema 2"
                  rows={3}
                  {...form.register('topicsWorkedOn')}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="exercisesPerformed" className="text-sm font-medium">
                  Ejercicios Realizados (uno por línea)
                </label>
                <Textarea
                  id="exercisesPerformed"
                  placeholder="Ejercicio 1&#10;Ejercicio 2"
                  rows={3}
                  {...form.register('exercisesPerformed')}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="results" className="text-sm font-medium">
                  Resultados Observados
                </label>
                <Textarea
                  id="results"
                  placeholder="¿Qué se observó en la clase?"
                  {...form.register('results')}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="whatWentWell" className="text-sm font-medium">
                    Qué Salió Bien
                  </label>
                  <Textarea
                    id="whatWentWell"
                    placeholder="Aspectos positivos..."
                    rows={3}
                    {...form.register('whatWentWell')}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="whatNeedsWork" className="text-sm font-medium">
                    Necesita Refuerzo
                  </label>
                  <Textarea
                    id="whatNeedsWork"
                    placeholder="Áreas a mejorar..."
                    rows={3}
                    {...form.register('whatNeedsWork')}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="nextSteps" className="text-sm font-medium">
                  Próximos Pasos
                </label>
                <Textarea
                  id="nextSteps"
                  placeholder="¿Qué trabajar en la próxima clase?"
                  {...form.register('nextSteps')}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="homework" className="text-sm font-medium">
                  Tarea para Casa
                </label>
                <Textarea
                  id="homework"
                  placeholder="Ejercicios para practicar en casa..."
                  {...form.register('homework')}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="progressNotes" className="text-sm font-medium">
                  Notas de Progreso
                </label>
                <Textarea
                  id="progressNotes"
                  placeholder="Evaluación breve del progreso..."
                  {...form.register('progressNotes')}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="teacherNotes" className="text-sm font-medium">
                  Notas del Profesor
                </label>
                <Textarea
                  id="teacherNotes"
                  placeholder="Notas privadas..."
                  {...form.register('teacherNotes')}
                />
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
                  {editingRecord ? 'Guardar Cambios' : 'Crear Registro'}
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
          <label className="text-sm font-medium">Filtrar por asistencia</label>
          <Select value={filterAttendance} onValueChange={setFilterAttendance}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Todos los estados" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="attended">Presente</SelectItem>
              <SelectItem value="absent">Ausente</SelectItem>
              <SelectItem value="cancelled">Cancelada</SelectItem>
              <SelectItem value="rescheduled">Reprogramada</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Records List */}
      {filteredRecords.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Registros ({filteredRecords.length})</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {filteredRecords.map((record) => {
              const student = students.find((s) => s.id === record.studentId);

              return (
                <Card key={record.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {student ? getStudentFullName(student) : 'Clase grupal'}
                          {getAttendanceBadge(record.attendance)}
                        </CardTitle>
                        <CardDescription className="mt-1 flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(record.date)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {record.duration} min
                          </span>
                          {record.classTypeId && (
                            <span>{getClassTypeName(record.classTypeId)}</span>
                          )}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEdit(record)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleDelete(record.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      {record.topicsWorkedOn && record.topicsWorkedOn.length > 0 && (
                        <div>
                          <p className="font-medium">Temas trabajados:</p>
                          <p className="text-muted-foreground">
                            {record.topicsWorkedOn.join(', ')}
                          </p>
                        </div>
                      )}

                      {record.whatWentWell && (
                        <div>
                          <p className="font-medium text-green-600">Qué salió bien:</p>
                          <p className="text-muted-foreground">{record.whatWentWell}</p>
                        </div>
                      )}

                      {record.whatNeedsWork && (
                        <div>
                          <p className="font-medium text-amber-600">Necesita refuerzo:</p>
                          <p className="text-muted-foreground">{record.whatNeedsWork}</p>
                        </div>
                      )}

                      {record.nextSteps && (
                        <div>
                          <p className="font-medium">Próximos pasos:</p>
                          <p className="text-muted-foreground">{record.nextSteps}</p>
                        </div>
                      )}

                      {record.homework && (
                        <div>
                          <p className="font-medium">Tarea:</p>
                          <p className="text-muted-foreground">{record.homework}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileText className="h-16 w-16 text-muted-foreground/50" />
            <p className="mt-4 text-lg font-medium">No hay registros</p>
            <p className="text-sm text-muted-foreground">
              Registra tu primera clase tomada
            </p>
          </CardContent>
        </Card>
      )}

      {/* Info Card */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-2">Beneficios del Registro</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span>✅</span>
              <span>Seguimiento preciso del progreso de cada alumno</span>
            </li>
            <li className="flex gap-2">
              <span>✅</span>
              <span>Memoria detallada de lo trabajado en cada sesión</span>
            </li>
            <li className="flex gap-2">
              <span>✅</span>
              <span>Identificación de patrones y áreas de mejora</span>
            </li>
            <li className="flex gap-2">
              <span>✅</span>
              <span>Base para conversaciones con alumnos sobre su evolución</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
