// features/library/pages/LibraryPage.tsx

import { Plus, Music, Pencil, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { melodyRepository } from '@/entities/repositories';
import type { Melody } from '@/shared/types/domain';
import { melodyFormSchema, type MelodyFormData } from '../schemas/melody-form.schema';
import { StorageService } from '@/shared/api/storage-service';
import { toast } from 'sonner';

export function LibraryPage() {
  const [melodies, setMelodies] = useState<Melody[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMelody, setEditingMelody] = useState<Melody | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const form = useForm<MelodyFormData>({
    resolver: zodResolver(melodyFormSchema),
    defaultValues: {
      name: '',
      description: '',
      category: undefined,
      difficulty: undefined,
      key: '',
      range: '',
      tempo: '',
      technicalObjective: '',
      teacherNotes: '',
      tags: '',
      audioFileReference: '',
    },
  });

  useEffect(() => {
    loadMelodies();
  }, []);

  useEffect(() => {
    if (editingMelody) {
      form.reset({
        name: editingMelody.name,
        description: editingMelody.description || '',
        category: editingMelody.category,
        difficulty: editingMelody.difficulty,
        key: editingMelody.key || '',
        range: editingMelody.range || '',
        tempo: editingMelody.tempo || '',
        technicalObjective: editingMelody.technicalObjective || '',
        teacherNotes: editingMelody.teacherNotes || '',
        tags: editingMelody.tags?.join(', ') || '',
        audioFileReference: editingMelody.audioFileReference || '',
      });
    } else {
      form.reset({
        name: '',
        description: '',
        category: undefined,
        difficulty: undefined,
        key: '',
        range: '',
        tempo: '',
        technicalObjective: '',
        teacherNotes: '',
        tags: '',
        audioFileReference: '',
      });
    }
  }, [editingMelody, form]);

  async function loadMelodies() {
    try {
      const data = await melodyRepository.getAll();
      setMelodies(data);
    } catch (error) {
      console.error('Error loading melodies:', error);
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(data: MelodyFormData) {
    setUploading(true);
    try {
      let audioPath = data.audioFileReference;

      // 1. Subir archivo si se seleccionó uno nuevo
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `melodies/${fileName}`;
        
        audioPath = await StorageService.uploadMelody(selectedFile, filePath);
        toast.success('Audio subido correctamente');
      }

      const tagsArray = data.tags
        ? data.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [];

      const melodyData: Omit<Melody, 'id' | 'createdAt' | 'updatedAt'> = {
        name: data.name,
        description: data.description || '',
        category: data.category,
        difficulty: data.difficulty,
        key: data.key || undefined,
        range: data.range || undefined,
        tempo: data.tempo || undefined,
        technicalObjective: data.technicalObjective || undefined,
        teacherNotes: data.teacherNotes || undefined,
        tags: tagsArray,
        audioFileReference: audioPath || undefined,
        isFavorite: editingMelody?.isFavorite || false,
        studentIds: editingMelody?.studentIds || [],
        classTypeIds: editingMelody?.classTypeIds || [],
      };

      if (editingMelody) {
        await melodyRepository.update(editingMelody.id, melodyData);
      } else {
        await melodyRepository.create(melodyData);
      }
      
      await loadMelodies();
      setDialogOpen(false);
      setEditingMelody(null);
      setSelectedFile(null);
      toast.success(editingMelody ? 'Melodía actualizada' : 'Melodía creada');
    } catch (error: any) {
      console.error('Error saving melody:', error);
      toast.error('Error al guardar: ' + (error.message || 'Error desconocido'));
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Estás seguro de eliminar esta melodía?')) return;
    try {
      await melodyRepository.delete(id);
      await loadMelodies();
    } catch (error) {
      console.error('Error deleting melody:', error);
    }
  }

  function handleEdit(melody: Melody) {
    setEditingMelody(melody);
    setDialogOpen(true);
  }

  function handleDialogClose(open: boolean) {
    setDialogOpen(open);
    if (!open) {
      setEditingMelody(null);
      setSelectedFile(null);
      form.reset();
    }
  }

  const getCategoryLabel = (category: Melody['category']) => {
    const labels = {
      scale: 'Escala',
      exercise: 'Ejercicio',
      warmup: 'Calentamiento',
      repertoire: 'Repertorio',
    };
    return labels[category];
  };

  const getDifficultyColor = (difficulty?: Melody['difficulty']) => {
    if (!difficulty) return 'secondary';
    const colors: Record<NonNullable<Melody['difficulty']>, 'success' | 'warning' | 'destructive'> = {
      easy: 'success',
      medium: 'warning',
      hard: 'destructive',
    };
    return colors[difficulty];
  };

  const getDifficultyLabel = (difficulty?: Melody['difficulty']) => {
    if (!difficulty) return '';
    const labels = {
      easy: 'Fácil',
      medium: 'Medio',
      hard: 'Difícil',
    };
    return labels[difficulty];
  };

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
          <h1 className="text-3xl font-bold tracking-tight">Biblioteca de Melodías</h1>
          <p className="text-muted-foreground">
            Escalas, ejercicios y recursos para práctica vocal
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Agregar Melodía
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingMelody ? 'Editar Melodía' : 'Agregar Melodía'}
              </DialogTitle>
              <DialogDescription>
                {editingMelody
                  ? 'Modifica los datos de la melodía'
                  : 'Agrega una nueva melodía a la biblioteca'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Nombre *
                </label>
                <Input
                  id="name"
                  placeholder="Ej: Escala de Do mayor"
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
                  placeholder="Breve descripción de la melodía"
                  {...form.register('description')}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="category" className="text-sm font-medium">
                    Categoría *
                  </label>
                  <Select
                    value={form.watch('category')}
                    onValueChange={(value) =>
                      form.setValue('category', value as MelodyFormData['category'])
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scale">Escala</SelectItem>
                      <SelectItem value="exercise">Ejercicio</SelectItem>
                      <SelectItem value="warmup">Calentamiento</SelectItem>
                      <SelectItem value="repertoire">Repertorio</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.category && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.category.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="difficulty" className="text-sm font-medium">
                    Dificultad
                  </label>
                  <Select
                    value={form.watch('difficulty')}
                    onValueChange={(value) =>
                      form.setValue('difficulty', value as MelodyFormData['difficulty'])
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Fácil</SelectItem>
                      <SelectItem value="medium">Medio</SelectItem>
                      <SelectItem value="hard">Difícil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label htmlFor="key" className="text-sm font-medium">
                    Tonalidad
                  </label>
                  <Input
                    id="key"
                    placeholder="Do mayor"
                    {...form.register('key')}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="range" className="text-sm font-medium">
                    Rango Vocal
                  </label>
                  <Input
                    id="range"
                    placeholder="Do3-Sol4"
                    {...form.register('range')}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="tempo" className="text-sm font-medium">
                    Tempo
                  </label>
                  <Input
                    id="tempo"
                    placeholder="60 BPM"
                    {...form.register('tempo')}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="technicalObjective" className="text-sm font-medium">
                  Objetivo Técnico
                </label>
                <Textarea
                  id="technicalObjective"
                  placeholder="¿Qué trabajas con esta melodía?"
                  {...form.register('technicalObjective')}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="teacherNotes" className="text-sm font-medium">
                  Notas del Profesor
                </label>
                <Textarea
                  id="teacherNotes"
                  placeholder="Notas privadas para ti"
                  {...form.register('teacherNotes')}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="tags" className="text-sm font-medium">
                  Tags
                </label>
                <Input
                  id="tags"
                  placeholder="Separados por coma: vocal, calentamiento, etc."
                  {...form.register('tags')}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="audioFile" className="text-sm font-medium">
                  Archivo de Audio (MP3/WAV)
                </label>
                <div className="flex flex-col gap-2">
                  <Input
                    id="audioFile"
                    type="file"
                    accept="audio/*"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="cursor-pointer file:cursor-pointer file:text-primary file:font-semibold"
                  />
                  {editingMelody?.audioFileReference && !selectedFile && (
                    <p className="text-[10px] text-muted-foreground italic">
                      Ya tiene un audio asignado. Selecciona otro para reemplazarlo.
                    </p>
                  )}
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleDialogClose(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={uploading}>
                  {uploading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent mr-2" />
                      Subiendo...
                    </>
                  ) : (
                    editingMelody ? 'Guardar Cambios' : 'Agregar Melodía'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>


      {/* Melodies Grid */}
      {melodies.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {melodies.map((melody) => (
            <Card key={melody.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base flex items-center gap-2">
                      {melody.isFavorite && <span className="text-yellow-500">⭐</span>}
                      {melody.name}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {melody.description || 'Sin descripción'}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleEdit(melody)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => handleDelete(melody.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Music className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{getCategoryLabel(melody.category)}</Badge>
                    {melody.difficulty && (
                      <Badge variant={getDifficultyColor(melody.difficulty) as any}>
                        {getDifficultyLabel(melody.difficulty)}
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-1 text-sm">
                    {melody.key && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tonalidad:</span>
                        <span className="font-medium">{melody.key}</span>
                      </div>
                    )}
                    {melody.range && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Rango:</span>
                        <span className="font-medium">{melody.range}</span>
                      </div>
                    )}
                    {melody.tempo && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tempo:</span>
                        <span className="font-medium">{melody.tempo}</span>
                      </div>
                    )}
                  </div>

                  {melody.technicalObjective && (
                    <div className="pt-2 border-t">
                      <p className="text-xs font-medium text-muted-foreground mb-1">
                        Objetivo Técnico:
                      </p>
                      <p className="text-xs">{melody.technicalObjective}</p>
                    </div>
                  )}

                  {melody.teacherNotes && (
                    <div className="pt-2 border-t">
                      <p className="text-xs font-medium text-muted-foreground mb-1">
                        Notas del Profesor:
                      </p>
                      <p className="text-xs text-muted-foreground italic">
                        {melody.teacherNotes}
                      </p>
                    </div>
                  )}

                  {melody.tags && melody.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-2">
                      {melody.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {melody.audioFileReference && (
                    <div className="pt-3">
                      <audio 
                        controls 
                        className="w-full h-8 [&::-webkit-media-controls-enclosure]:bg-surface-dark [&::-webkit-media-controls-panel]:bg-surface-dark"
                        src={StorageService.getPublicUrl(melody.audioFileReference)}
                      >
                        Tu navegador no soporta el elemento de audio.
                      </audio>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Music className="h-16 w-16 text-muted-foreground/50" />
            <p className="mt-4 text-lg font-medium">No hay melodías en la biblioteca</p>
            <p className="text-sm text-muted-foreground">
              Agrega escalas y ejercicios para organizar tu material didáctico
            </p>
          </CardContent>
        </Card>
      )}

      {/* Info Card */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-2">💡 Sobre la Biblioteca</h3>
          <p className="text-sm text-muted-foreground">
            La biblioteca te permite organizar tu material didáctico: escalas, ejercicios vocales, 
            calentamientos y repertorio. Puedes categorizar por dificultad, tonalidad, objetivo técnico 
            y asignar melodías específicas a tus alumnos. En futuras versiones podrás subir archivos de 
            audio y reproducirlos directamente desde la aplicación.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
