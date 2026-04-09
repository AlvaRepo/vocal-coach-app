import { useState, useEffect } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer, View, SlotInfo } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { classPlanRepository, classRecordRepository } from '@/entities/repositories';
import { studentRepository } from '@/entities/student/repository';
import { noteRepository } from '@/entities/repositories';
import type { ClassPlan, ClassRecord, Note, Student } from '@/shared/types/domain';

import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = { es };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  resource: {
    type: 'plan' | 'record' | 'note';
    data: ClassPlan | ClassRecord | Note;
  };
};

const eventSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  date: z.string().min(1, 'La fecha es requerida'),
  time: z.string().default('10:00'),
  duration: z.number().min(15).default(60),
  type: z.enum(['plan', 'record']),
  studentId: z.string().optional(),
  description: z.string().optional(),
});

type EventFormData = z.infer<typeof eventSchema>;

interface CalendarPageProps {
  onNavigate?: (view: View, date: Date) => void;
  initialView?: View;
  initialDate?: Date;
}

export function CalendarPage({ onNavigate, initialView = 'month', initialDate = new Date() }: CalendarPageProps) {
  const [view, setView] = useState<View>(initialView);
  const [date, setDate] = useState<Date>(initialDate);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showPlans, setShowPlans] = useState(true);
  const [showRecords, setShowRecords] = useState(true);
  const [showNotes, setShowNotes] = useState(true);
  
  const [students, setStudents] = useState<Student[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '10:00',
      duration: 60,
      type: 'plan',
      studentId: '',
      description: '',
    },
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [plans, records, notes, allStudents] = await Promise.all([
        classPlanRepository.getAll(),
        classRecordRepository.getAll(),
        noteRepository.getAll(),
        studentRepository.getAll(),
      ]);
      
      setStudents(allStudents);
      
      const calendarEvents: CalendarEvent[] = [];
      
      if (showPlans) {
        plans.forEach((plan) => {
          if (plan.date) {
            const planDate = parseISO(plan.date);
            calendarEvents.push({
              id: plan.id,
              title: plan.title || `Plan de clase - ${getStudentName(plan.studentId, allStudents)}`,
              start: planDate,
              end: new Date(planDate.getTime() + (plan.duration || 60) * 60000),
              allDay: false,
              resource: { type: 'plan', data: plan },
            });
          }
        });
      }
      
      if (showRecords) {
        records.forEach((record) => {
          const recordDate = parseISO(record.date);
          calendarEvents.push({
            id: record.id,
            title: `Clase: ${getStudentName(record.studentId, allStudents) || 'Grupal'}`,
            start: recordDate,
            end: new Date(recordDate.getTime() + (record.duration || 60) * 60000),
            allDay: false,
            resource: { type: 'record', data: record },
          });
        });
      }
      
      if (showNotes) {
        notes.forEach((note) => {
          if (note.createdAt) {
            const noteDate = parseISO(note.createdAt);
            calendarEvents.push({
              id: note.id,
              title: `📝 ${note.title || 'Nota'}`,
              start: noteDate,
              end: new Date(noteDate.getTime() + 30 * 60000),
              allDay: true,
              resource: { type: 'note', data: note },
            });
          }
        });
      }
      
      setEvents(calendarEvents);
    } catch (error) {
      console.error('Error loading calendar data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [showPlans, showRecords, showNotes]);

  const getStudentName = (studentId?: string, studentsList?: Student[]) => {
    if (!studentId || !studentsList) return null;
    const student = studentsList.find(s => s.id === studentId);
    return student ? `${student.firstName} ${student.lastName}` : null;
  };

  const handleSelectSlot = (slotInfo: SlotInfo) => {
    const startDate = slotInfo.start;
    form.setValue('date', format(startDate, 'yyyy-MM-dd'));
    form.setValue('title', '');
    setSelectedEvent(null);
    setDialogOpen(true);
  };

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    form.setValue('title', event.title);
    form.setValue('date', format(event.start, 'yyyy-MM-dd'));
    form.setValue('time', format(event.start, 'HH:mm'));
    dialogOpen;
  };

  const onSubmit = async (data: EventFormData) => {
    const [hours = 10, minutes = 0] = data.time.split(':').map(Number);
    const startDate = parseISO(data.date);
    startDate.setHours(isNaN(hours) ? 10 : hours, isNaN(minutes) ? 0 : minutes, 0, 0);
    
    if (data.type === 'plan') {
      const plan: Omit<ClassPlan, 'id' | 'createdAt' | 'updatedAt'> = {
        title: data.title,
        studentId: data.studentId || undefined,
        date: data.date,
        duration: data.duration,
        status: 'draft',
        objective: data.description,
      };
      await classPlanRepository.create(plan);
    } else {
      const record: Omit<ClassRecord, 'id' | 'createdAt' | 'updatedAt'> = {
        studentId: data.studentId || undefined,
        date: data.date,
        duration: data.duration,
        attendance: 'attended',
        topicsWorkedOn: data.description ? [data.description] : [],
        exercisesPerformed: [],
      };
      await classRecordRepository.create(record);
    }
    
    setDialogOpen(false);
    form.reset();
    loadData();
  };

  const eventStyleGetter = (event: CalendarEvent) => {
    let backgroundColor = '#3B82F6';
    
    if (event.resource.type === 'record') {
      backgroundColor = '#10B981';
    } else if (event.resource.type === 'note') {
      backgroundColor = '#F59E0B';
    }
    
    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
      },
    };
  };

  const CustomToolbar = ({ label, onNavigate, onView }: any) => (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => onNavigate('PREV')}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" onClick={() => onNavigate('TODAY')}>
          Hoy
        </Button>
        <Button variant="outline" size="icon" onClick={() => onNavigate('NEXT')}>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <span className="text-lg font-semibold ml-2">{label}</span>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant={view === 'month' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onView('month')}
        >
          Mes
        </Button>
        <Button
          variant={view === 'week' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onView('week')}
        >
          Semana
        </Button>
        <Button
          variant={view === 'day' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onView('day')}
        >
          Día
        </Button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-muted-foreground">Cargando calendario...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendario</h1>
          <p className="text-muted-foreground">
            Visualiza y gestiona tus clases, notas y planes
          </p>
        </div>
        <Button onClick={() => {
          form.reset();
          setSelectedEvent(null);
          setDialogOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Evento
        </Button>
      </div>

      <Card className="bg-surface-dark/60 border border-white/5 backdrop-blur-md">
        <CardContent className="pt-4">
          <div className="flex flex-wrap items-center gap-4 mb-6 p-3 bg-background/40 rounded-lg border border-white/5">
            <span className="text-sm font-medium text-muted-foreground">Mostrar:</span>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                id="showPlans"
                checked={showPlans}
                onChange={(e) => setShowPlans(e.target.checked)}
                className="w-4 h-4 rounded border-white/20 bg-surface-dark accent-soul-magenta"
              />
              <span className="text-sm group-hover:text-foreground transition-colors">Planes</span>
              <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30 text-[10px]">
                {events.filter(e => e.resource.type === 'plan').length}
              </Badge>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                id="showRecords"
                checked={showRecords}
                onChange={(e) => setShowRecords(e.target.checked)}
                className="w-4 h-4 rounded border-white/20 bg-surface-dark accent-soul-magenta"
              />
              <span className="text-sm group-hover:text-foreground transition-colors">Registros</span>
              <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30 text-[10px]">
                {events.filter(e => e.resource.type === 'record').length}
              </Badge>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                id="showNotes"
                checked={showNotes}
                onChange={(e) => setShowNotes(e.target.checked)}
                className="w-4 h-4 rounded border-white/20 bg-surface-dark accent-soul-magenta"
              />
              <span className="text-sm group-hover:text-foreground transition-colors">Notas</span>
              <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30 text-[10px]">
                {events.filter(e => e.resource.type === 'note').length}
              </Badge>
            </label>
          </div>

          <div className="h-[600px]">
            <BigCalendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              view={view}
              onView={(v) => {
                setView(v);
                onNavigate?.(v, date);
              }}
              date={date}
              onNavigate={(d) => {
                setDate(d);
                onNavigate?.(view, d);
              }}
              onSelectEvent={handleSelectEvent}
              onSelectSlot={handleSelectSlot}
              selectable
              eventPropGetter={eventStyleGetter}
              components={{
                toolbar: CustomToolbar,
              }}
              messages={{
                today: 'Hoy',
                previous: '<',
                next: '>',
                month: 'Mes',
                week: 'Semana',
                day: 'Día',
                agenda: 'Agenda',
                noEventsInRange: 'No hay eventos en este período',
              }}
              culture="es"
              style={{ height: '100%' }}
            />
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {selectedEvent ? 'Ver Evento' : 'Nuevo Evento'}
            </DialogTitle>
            <DialogDescription>
              {selectedEvent 
                ? `Tipo: ${selectedEvent.resource.type === 'plan' ? 'Plan de clase' : selectedEvent.resource.type === 'record' ? 'Registro de clase' : 'Nota'}`
                : 'Crea un nuevo evento en el calendario'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input id="title" {...form.register('title')} placeholder="Título del evento" />
              {form.formState.errors.title && (
                <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Fecha</Label>
                <Input id="date" type="date" {...form.register('date')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Hora</Label>
                <Input id="time" type="time" {...form.register('time')} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Tipo</Label>
                <Select
                  value={form.watch('type')}
                  onValueChange={(value) => form.setValue('type', value as 'plan' | 'record')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="plan">Plan de clase</SelectItem>
                    <SelectItem value="record">Registro de clase</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duración (min)</Label>
                <Select
                  value={String(form.watch('duration'))}
                  onValueChange={(value) => form.setValue('duration', Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Duración" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 min</SelectItem>
                    <SelectItem value="45">45 min</SelectItem>
                    <SelectItem value="60">60 min</SelectItem>
                    <SelectItem value="90">90 min</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="studentId">Estudiante (opcional)</Label>
              <Select
                value={form.watch('studentId') || 'none'}
                onValueChange={(value) => form.setValue('studentId', value === 'none' ? '' : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estudiante" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin estudiante</SelectItem>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.firstName} {student.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Input id="description" {...form.register('description')} placeholder="Descripción opcional" />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                {selectedEvent ? 'Guardar' : 'Crear Evento'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}