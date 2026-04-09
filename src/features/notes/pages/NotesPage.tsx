// features/notes/pages/NotesPage.tsx

import { Plus, StickyNote, Pencil, Trash2, Pin, PinOff } from 'lucide-react';
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
import { noteRepository } from '@/entities/repositories';
import { studentRepository } from '@/entities/student/repository';
import type { Note, Student } from '@/shared/types/domain';
import { noteFormSchema, type NoteFormData } from '../schemas/note-form.schema';

export function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStudent, setFilterStudent] = useState<string>('all');

  const form = useForm<NoteFormData>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: {
      title: '',
      content: '',
      type: undefined,
      category: '',
      studentId: '',
      classRecordId: '',
      tags: '',
      isPinned: false,
    },
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (editingNote) {
      form.reset({
        title: editingNote.title || '',
        content: editingNote.content,
        type: editingNote.type,
        category: editingNote.category || '',
        studentId: editingNote.studentId || '',
        classRecordId: editingNote.classRecordId || '',
        tags: editingNote.tags?.join(', ') || '',
        isPinned: editingNote.isPinned || false,
      });
    } else {
      form.reset({
        title: '',
        content: '',
        type: undefined,
        category: '',
        studentId: '',
        classRecordId: '',
        tags: '',
        isPinned: false,
      });
    }
  }, [editingNote, form]);

  async function loadData() {
    try {
      const [notesData, studentsData] = await Promise.all([
        noteRepository.getAll(),
        studentRepository.getAll(),
      ]);
      setNotes(notesData);
      setStudents(studentsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(data: NoteFormData) {
    const tagsArray = data.tags
      ? data.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    const noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'> = {
      title: data.title,
      content: data.content,
      type: data.type,
      category: data.category || undefined,
      studentId: data.studentId || undefined,
      classRecordId: data.classRecordId || undefined,
      tags: tagsArray,
      isPinned: data.isPinned || false,
    };

    try {
      if (editingNote) {
        await noteRepository.update(editingNote.id, noteData);
      } else {
        await noteRepository.create(noteData);
      }
      await loadData();
      setDialogOpen(false);
      setEditingNote(null);
    } catch (error) {
      console.error('Error saving note:', error);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Estás seguro de eliminar esta nota?')) return;
    try {
      await noteRepository.delete(id);
      await loadData();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  }

  async function handleTogglePin(note: Note) {
    try {
      await noteRepository.update(note.id, { isPinned: !note.isPinned });
      await loadData();
    } catch (error) {
      console.error('Error toggling pin:', error);
    }
  }

  function handleEdit(note: Note) {
    setEditingNote(note);
    setDialogOpen(true);
  }

  function handleDialogClose(open: boolean) {
    setDialogOpen(open);
    if (!open) {
      setEditingNote(null);
      form.reset();
    }
  }

  const getTypeLabel = (type: Note['type']) => {
    const labels: Record<Note['type'], string> = {
      quick: 'Rápida',
      detailed: 'Detallada',
      class: 'De Clase',
      general: 'General',
      private: 'Privada',
    };
    return labels[type];
  };

  const getTypeColor = (type: Note['type']) => {
    const colors: Record<Note['type'], string> = {
      quick: 'bg-blue-100 text-blue-800',
      detailed: 'bg-purple-100 text-purple-800',
      class: 'bg-green-100 text-green-800',
      general: 'bg-gray-100 text-gray-800',
      private: 'bg-red-100 text-red-800',
    };
    return colors[type];
  };

  const getStudentName = (studentId?: string) => {
    if (!studentId) return null;
    const student = students.find((s) => s.id === studentId);
    return student ? `${student.firstName} ${student.lastName}` : null;
  };

  const filteredNotes = notes.filter((note) => {
    if (filterType !== 'all' && note.type !== filterType) return false;
    if (filterStudent !== 'all' && note.studentId !== filterStudent) return false;
    return true;
  });

  const pinnedNotes = filteredNotes.filter((n) => n.isPinned);
  const unpinnedNotes = filteredNotes.filter((n) => !n.isPinned);

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
          <h1 className="text-3xl font-bold tracking-tight">Notas</h1>
          <p className="text-muted-foreground">
            Sistema de notas y observaciones del profesor
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Nota
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingNote ? 'Editar Nota' : 'Nueva Nota'}
              </DialogTitle>
              <DialogDescription>
                {editingNote
                  ? 'Modifica los datos de la nota'
                  : 'Crea una nueva nota'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Título *
                </label>
                <Input
                  id="title"
                  placeholder="Título de la nota"
                  {...form.register('title')}
                />
                {form.formState.errors.title && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.title.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="content" className="text-sm font-medium">
                  Contenido *
                </label>
                <Textarea
                  id="content"
                  placeholder="Escribe tu nota..."
                  rows={5}
                  {...form.register('content')}
                />
                {form.formState.errors.content && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.content.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="type" className="text-sm font-medium">
                    Tipo de Nota *
                  </label>
                  <Select
                    value={form.watch('type')}
                    onValueChange={(value) =>
                      form.setValue('type', value as NoteFormData['type'])
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="quick">Rápida</SelectItem>
                      <SelectItem value="detailed">Detallada</SelectItem>
                      <SelectItem value="class">De Clase</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="private">Privada</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.type && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.type.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="category" className="text-sm font-medium">
                    Categoría
                  </label>
                  <Input
                    id="category"
                    placeholder="Ej: progreso, observación"
                    {...form.register('category')}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="studentId" className="text-sm font-medium">
                  Alumno Asociado
                </label>
                <Select
                  value={form.watch('studentId') || 'none'}
                  onValueChange={(value) => form.setValue('studentId', value === 'none' ? '' : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar alumno..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Ninguno</SelectItem>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.firstName} {student.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="tags" className="text-sm font-medium">
                  Tags
                </label>
                <Input
                  id="tags"
                  placeholder="Separados por coma"
                  {...form.register('tags')}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPinned"
                  {...form.register('isPinned')}
                  checked={form.watch('isPinned')}
                  onChange={(e) => form.setValue('isPinned', e.target.checked)}
                />
                <label htmlFor="isPinned" className="text-sm font-medium">
                  Destacar esta nota
                </label>
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
                  {editingNote ? 'Guardar Cambios' : 'Crear Nota'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Filtrar por tipo</label>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Todos los tipos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los tipos</SelectItem>
              <SelectItem value="quick">Rápida</SelectItem>
              <SelectItem value="detailed">Detallada</SelectItem>
              <SelectItem value="class">De Clase</SelectItem>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="private">Privada</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Filtrar por alumno</label>
          <Select value={filterStudent} onValueChange={setFilterStudent}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Todos los alumnos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los alumnos</SelectItem>
              {students.map((student) => (
                <SelectItem key={student.id} value={student.id}>
                  {student.firstName} {student.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Pinned Notes */}
      {pinnedNotes.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Pin className="h-4 w-4" /> Fijadas
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {pinnedNotes.map((note) => (
              <Card key={note.id} className="border-primary bg-primary/5">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base flex items-center gap-2">
                        {note.title}
                        <span
                          className={`text-xs px-2 py-0.5 rounded ${getTypeColor(note.type)}`}
                        >
                          {getTypeLabel(note.type)}
                        </span>
                      </CardTitle>
                      {note.studentId && (
                        <CardDescription className="mt-1">
                          Alumno: {getStudentName(note.studentId)}
                        </CardDescription>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleTogglePin(note)}
                      >
                        <PinOff className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEdit(note)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => handleDelete(note.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                  {note.tags && note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {note.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-3">
                    {new Date(note.createdAt).toLocaleDateString('es-AR')}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Notes List */}
      {unpinnedNotes.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {unpinnedNotes.map((note) => (
            <Card key={note.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base flex items-center gap-2">
                      {note.title}
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${getTypeColor(note.type)}`}
                      >
                        {getTypeLabel(note.type)}
                      </span>
                    </CardTitle>
                    {note.studentId && (
                      <CardDescription className="mt-1">
                        Alumno: {getStudentName(note.studentId)}
                      </CardDescription>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleTogglePin(note)}
                    >
                      <Pin className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleEdit(note)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => handleDelete(note.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                {note.tags && note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {note.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-3">
                  {new Date(note.createdAt).toLocaleDateString('es-AR')}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredNotes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <StickyNote className="h-16 w-16 text-muted-foreground/50" />
            <p className="mt-4 text-lg font-medium">No hay notas</p>
            <p className="text-sm text-muted-foreground">
              Crea tu primera nota para empezar a registrar observaciones
            </p>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
