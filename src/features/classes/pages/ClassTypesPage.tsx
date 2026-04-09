// features/classes/pages/ClassTypesPage.tsx

import { Plus, BookOpen, Clock, Pencil, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { classTypeRepository, classPlanRepository, classRecordRepository } from '@/entities/repositories';
import type { ClassType } from '@/shared/types/domain';
import { classTypeFormSchema, type ClassTypeFormData } from '../schemas/class-type-form.schema';

export function ClassTypesPage() {
  const [classTypes, setClassTypes] = useState<ClassType[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingClassType, setEditingClassType] = useState<ClassType | null>(null);

  const form = useForm<ClassTypeFormData>({
    resolver: zodResolver(classTypeFormSchema),
    defaultValues: {
      name: '',
      description: '',
      suggestedDuration: 60,
      objectives: '',
      structure: '',
    },
  });

  useEffect(() => {
    loadClassTypes();
  }, []);

  useEffect(() => {
    if (editingClassType) {
      form.reset({
        name: editingClassType.name,
        description: editingClassType.description || '',
        suggestedDuration: editingClassType.suggestedDuration,
        objectives: editingClassType.objectives?.join('\n') || '',
        structure: editingClassType.structure || '',
      });
    } else {
      form.reset({
        name: '',
        description: '',
        suggestedDuration: 60,
        objectives: '',
        structure: '',
      });
    }
  }, [editingClassType, form]);

  async function loadClassTypes() {
    try {
      const data = await classTypeRepository.getAll();
      setClassTypes(data);
    } catch (error) {
      console.error('Error loading class types:', error);
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(data: ClassTypeFormData) {
    const objectivesArray = data.objectives
      ? data.objectives.split('\n').map((o) => o.trim()).filter(Boolean)
      : [];

    const classTypeData: Omit<ClassType, 'id' | 'createdAt' | 'updatedAt'> = {
      name: data.name,
      description: data.description || undefined,
      suggestedDuration: data.suggestedDuration,
      objectives: objectivesArray,
      structure: data.structure || undefined,
    };

    try {
      if (editingClassType) {
        await classTypeRepository.update(editingClassType.id, classTypeData);
      } else {
        await classTypeRepository.create(classTypeData);
      }
      await loadClassTypes();
      setDialogOpen(false);
      setEditingClassType(null);
    } catch (error) {
      console.error('Error saving class type:', error);
    }
  }

  async function handleDelete(id: string) {
    const plansUsing = await classPlanRepository.query({ classTypeId: id });
    const recordsUsing = await classRecordRepository.query({ classTypeId: id });

    if (plansUsing.length > 0 || recordsUsing.length > 0) {
      alert(
        `No se puede eliminar este tipo de clase. Está en uso en ${plansUsing.length} planes y ${recordsUsing.length} registros de clase.`
      );
      return;
    }

    if (!confirm('¿Estás seguro de eliminar este tipo de clase?')) return;

    try {
      await classTypeRepository.delete(id);
      await loadClassTypes();
    } catch (error) {
      console.error('Error deleting class type:', error);
    }
  }

  function handleEdit(classType: ClassType) {
    setEditingClassType(classType);
    setDialogOpen(true);
  }

  function handleDialogClose(open: boolean) {
    setDialogOpen(open);
    if (!open) {
      setEditingClassType(null);
      form.reset();
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tipos de Clases</h1>
          <p className="text-muted-foreground">
            Define y gestiona los diferentes tipos de clases que ofreces
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Tipo de Clase
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingClassType ? 'Editar Tipo de Clase' : 'Nuevo Tipo de Clase'}
              </DialogTitle>
              <DialogDescription>
                {editingClassType
                  ? 'Modifica los datos del tipo de clase'
                  : 'Crea un nuevo tipo de clase'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Nombre *
                </label>
                <Input
                  id="name"
                  placeholder="Ej: Clase Particular, Coro, Grupal"
                  {...form.register('name')}
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Descripción
                </label>
                <Textarea
                  id="description"
                  placeholder="Breve descripción del tipo de clase"
                  {...form.register('description')}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="suggestedDuration" className="text-sm font-medium">
                  Duración Sugerida (minutos) *
                </label>
                <Input
                  id="suggestedDuration"
                  type="number"
                  min={15}
                  max={180}
                  {...form.register('suggestedDuration')}
                />
                {form.formState.errors.suggestedDuration && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.suggestedDuration.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="objectives" className="text-sm font-medium">
                  Objetivos (uno por línea)
                </label>
                <Textarea
                  id="objectives"
                  placeholder="Objetivo 1&#10;Objetivo 2&#10;Objetivo 3"
                  rows={4}
                  {...form.register('objectives')}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="structure" className="text-sm font-medium">
                  Estructura / Template
                </label>
                <Textarea
                  id="structure"
                  placeholder="Estructura base de la clase..."
                  rows={4}
                  {...form.register('structure')}
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
                  {editingClassType ? 'Guardar Cambios' : 'Crear Tipo de Clase'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Class Types Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {classTypes.map((classType) => (
          <Card key={classType.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    {classType.name}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {classType.description || 'Sin descripción'}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleEdit(classType)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => handleDelete(classType.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Duración sugerida: {classType.suggestedDuration} minutos</span>
                </div>

                {classType.objectives && classType.objectives.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Objetivos:</p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      {classType.objectives.slice(0, 3).map((objective, idx) => (
                        <li key={idx}>{objective}</li>
                      ))}
                      {classType.objectives.length > 3 && (
                        <li className="text-xs">+{classType.objectives.length - 3} más...</li>
                      )}
                    </ul>
                  </div>
                )}

                {classType.structure && (
                  <div>
                    <p className="text-sm font-medium mb-2">Estructura:</p>
                    <p className="text-xs text-muted-foreground whitespace-pre-wrap line-clamp-3">
                      {classType.structure}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {classTypes.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <BookOpen className="h-16 w-16 text-muted-foreground/50" />
            <p className="mt-4 text-lg font-medium">No hay tipos de clase</p>
            <p className="text-sm text-muted-foreground">
              Crea tu primer tipo de clase para empezar
            </p>
          </CardContent>
        </Card>
      )}

      {/* Info Note */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            💡 Los tipos de clases son plantillas que te ayudan a estructurar y planificar 
            tus sesiones. Puedes crear clases basadas en estos tipos o personalizarlas según 
            las necesidades de cada alumno.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
