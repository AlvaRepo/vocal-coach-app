// features/students/pages/StudentFormPage.tsx

import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { studentRepository } from '@/entities/student/repository';
import { studentFormSchema, type StudentFormData } from '../schemas/student-form.schema';
import { getTodayISO } from '@/shared/lib/date-utils';
import type { Student } from '@/shared/types/domain';

export function StudentFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;
  const [loading, setLoading] = useState(isEditing);

  const form = useForm<StudentFormData>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      photoUrl: '',
      type: 'private',
      status: 'active',
      joinDate: getTodayISO().split('T')[0],
      vocalRange: 'undefined',
    },
  });

  useEffect(() => {
    if (isEditing && id) {
      loadStudent(id);
    }
  }, [id, isEditing]);

  async function loadStudent(studentId: string) {
    try {
      const student = await studentRepository.getById(studentId);
      if (!student) {
        toast.error('Alumno no encontrado');
        navigate('/students');
        return;
      }

      // Convertir Student a StudentFormData
      form.reset({
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email || '',
        phone: student.phone || '',
        photoUrl: student.photoUrl || '',
        birthDate: student.birthDate || '',
        type: student.type,
        status: student.status,
        joinDate: student.joinDate.split('T')[0],
        vocalRange: student.vocalRange || 'undefined',
        level: student.level,
        goals: student.goals || '',
        generalObservations: student.generalObservations || '',
        importantAlerts: student.importantAlerts?.join('\n') || '',
        tags: student.tags?.join(', ') || '',
      });
    } catch (error) {
      console.error('Error loading student:', error);
      toast.error('Error al cargar alumno');
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(data: StudentFormData) {
    try {
      // Convertir FormData a Student
      const studentData: Omit<Student, 'id' | 'createdAt' | 'updatedAt'> = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email || undefined,
        phone: data.phone || undefined,
        birthDate: data.birthDate || undefined,
        type: data.type,
        status: data.status,
        joinDate: data.joinDate,
        vocalRange: data.vocalRange === 'undefined' ? undefined : data.vocalRange,
        level: data.level,
        goals: data.goals || undefined,
        generalObservations: data.generalObservations || undefined,
        importantAlerts: data.importantAlerts
          ? data.importantAlerts.split('\n').filter(Boolean)
          : undefined,
        tags: data.tags
          ? data.tags.split(',').map(t => t.trim()).filter(Boolean)
          : undefined,
      };

      if (isEditing && id) {
        await studentRepository.update(id, studentData);
        toast.success('Alumno actualizado');
        navigate(`/students/${id}`);
      } else {
        const newStudent = await studentRepository.create(studentData);
        toast.success('Alumno creado');
        navigate(`/students/${newStudent.id}`);
      }
    } catch (error) {
      console.error('Error saving student:', error);
      toast.error('Error al guardar alumno');
    }
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to={isEditing ? `/students/${id}` : '/students'}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEditing ? 'Editar Alumno' : 'Nuevo Alumno'}
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? 'Modifica los datos del alumno' : 'Completa la información del nuevo alumno'}
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
              <CardDescription>Datos básicos del alumno</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre *</FormLabel>
                      <FormControl>
                        <Input placeholder="María" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apellido *</FormLabel>
                      <FormControl>
                        <Input placeholder="González" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="maria@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono</FormLabel>
                      <FormControl>
                        <Input placeholder="+54 9 387 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="photoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL de Foto</FormLabel>
                    <FormControl>
                      <Input placeholder="https://ejemplo.com/foto.jpg" {...field} />
                    </FormControl>
                    <FormDescription>
                      URL pública de la foto del alumno
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Nacimiento</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Información Académica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Alumno *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="choir">Solo Coro</SelectItem>
                          <SelectItem value="private">Solo Clase Particular</SelectItem>
                          <SelectItem value="both">Coro + Particular</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Activo</SelectItem>
                          <SelectItem value="paused">Pausado</SelectItem>
                          <SelectItem value="graduated">Egresado</SelectItem>
                          <SelectItem value="archived">Archivado</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="joinDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de Ingreso *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="vocalRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tesitura Vocal</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="undefined">No definido</SelectItem>
                          <SelectItem value="soprano">Soprano</SelectItem>
                          <SelectItem value="mezzo">Mezzosoprano</SelectItem>
                          <SelectItem value="alto">Alto/Contralto</SelectItem>
                          <SelectItem value="tenor">Tenor</SelectItem>
                          <SelectItem value="baritone">Barítono</SelectItem>
                          <SelectItem value="bass">Bajo</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nivel</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona nivel" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="beginner">Principiante</SelectItem>
                          <SelectItem value="intermediate">Intermedio</SelectItem>
                          <SelectItem value="advanced">Avanzado</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="goals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Objetivos</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe los objetivos del alumno..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="generalObservations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observaciones Generales</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Observaciones sobre el alumno..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="importantAlerts"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alertas Importantes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Una alerta por línea..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Escribe cada alerta en una línea separada
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Etiquetas</FormLabel>
                    <FormControl>
                      <Input placeholder="coro-principal, clases-martes, repertorio-clasico" {...field} />
                    </FormControl>
                    <FormDescription>
                      Separa las etiquetas con comas
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" asChild>
              <Link to={isEditing ? `/students/${id}` : '/students'}>
                Cancelar
              </Link>
            </Button>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              {isEditing ? 'Guardar Cambios' : 'Crear Alumno'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
